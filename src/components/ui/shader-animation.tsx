'use client';

import { useEffect, useRef } from 'react';

// ─── GLSL Shaders ─────────────────────────────────────────────────────────────

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fractal Brownian Motion fluid shader — dark base with brand-colour aurora waves
const FRAGMENT_SHADER = `
  precision highp float;

  uniform float u_time;
  uniform vec2  u_resolution;

  // ── Utilities ───────────────────────────────────────────────────────────────

  mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // fBm — 5 octaves, slight rotation per layer for organic look
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.52;
    for (int i = 0; i < 5; i++) {
      v += a * smoothNoise(p);
      p  = rot(0.37) * p * 2.03;
      a *= 0.48;
    }
    return v;
  }

  // ── Main ────────────────────────────────────────────────────────────────────

  void main() {
    // Normalized coords centred at middle
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);

    float t  = u_time * 0.18;

    // Two layers of warped fBm give the "fluid" look
    vec2 q = vec2(
      fbm(uv + t * 0.28),
      fbm(uv + vec2(5.2, 1.3))
    );

    vec2 r = vec2(
      fbm(uv + 3.8 * q + vec2(1.7,  9.2) + t * 0.14),
      fbm(uv + 3.8 * q + vec2(8.3,  2.8) + t * 0.11)
    );

    float f = fbm(uv + 3.8 * r);

    // ── Palette ──────────────────────────────────────────────────────────────
    // Very dark base — keeps background near-black
    vec3 dark  = vec3(0.030, 0.020, 0.030);
    // Brand red  #E01F54
    vec3 red   = vec3(0.878, 0.122, 0.329);
    // Brand teal #007791
    vec3 teal  = vec3(0.000, 0.467, 0.569);
    // Mid purple for smooth bridge
    vec3 purp  = vec3(0.18,  0.05,  0.18);

    // Layer 1: dark → purple, driven by fBm result
    vec3 col = mix(dark, purp, clamp(f * f * 3.2, 0.0, 1.0));

    // Layer 2: add teal glow where q has length
    col = mix(col, teal, clamp(length(q) * 0.55, 0.0, 1.0));

    // Layer 3: punch of red at high-frequency peaks
    col = mix(col, red,  clamp((f * f * f) * 2.8, 0.0, 1.0));

    // ── Vignette — pull edges back to pure black ──────────────────────────────
    float vign = 1.0 - smoothstep(0.55, 1.45, length(uv * 0.72));
    col *= vign;

    // ── Brightness cap — stays dark so text pops ─────────────────────────────
    col = col * 0.42 + 0.012;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ─── WebGL helpers ────────────────────────────────────────────────────────────

function createShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vert: string, frag: string) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vert);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ShaderAnimationProps {
  /** Extra Tailwind / CSS classes on the canvas wrapper */
  className?: string;
}

export default function ShaderAnimation({ className = '' }: ShaderAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return; // silently fall back — the dark bg-[#080808] shows instead

    // ── Program ──────────────────────────────────────────────────────────────
    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) return;
    gl.useProgram(program);

    // ── Full-screen quad ─────────────────────────────────────────────────────
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // ── Uniform locations ────────────────────────────────────────────────────
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes  = gl.getUniformLocation(program, 'u_resolution');

    // ── Resize handler ───────────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Animation loop ───────────────────────────────────────────────────────
    let raf = 0;
    const start = performance.now();

    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    render();

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ display: 'block' }}
      aria-hidden="true"
    />
  );
}
