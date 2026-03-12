export default function NotFound() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
        @keyframes drift {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.6); }
        }
        .planet { animation: float 3s ease-in-out infinite; }
        .astronaut { animation: drift 4s ease-in-out infinite; }
        .star { animation: twinkle 2s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        {/* Ilustrasi */}
        <div className="relative w-[280px] h-[180px] mb-8">
          {/* Bintang-bintang */}
          {[
            { w: 4, left: 20, top: 30, delay: "0s" },
            { w: 3, left: 60, top: 15, delay: "0.4s" },
            { w: 5, left: 200, top: 25, delay: "0.8s" },
            { w: 3, left: 240, top: 60, delay: "0.2s" },
            { w: 4, left: 30, top: 120, delay: "1s" },
            { w: 3, left: 250, top: 140, delay: "0.6s" },
            { w: 4, left: 120, top: 10, delay: "1.2s" },
          ].map((s, i) => (
            <div
              key={i}
              className="star absolute rounded-full bg-primary"
              style={{
                width: s.w,
                height: s.w,
                left: s.left,
                top: s.top,
                animationDelay: s.delay,
              }}
            />
          ))}

          {/* Planet */}
          <div
            className="planet absolute rounded-full bg-primary"
            style={{
              width: 80,
              height: 80,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Cincin planet */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: -22,
                transform: "translateY(-50%)",
                width: 124,
                height: 28,
                borderRadius: "50%",
                border: "3px solid #a78bfa",
              }}
            />
          </div>

          {/* Tali astronot */}
          <div
            style={{
              position: "absolute",
              right: 44,
              top: 36,
              width: 30,
              height: 2,
              background: "#a78bfa",
              borderRadius: 1,
              transform: "rotate(-10deg)",
            }}
          />

          {/* Astronot */}
          <div
            className="astronaut absolute"
            style={{ right: 20, top: 20, width: 48, height: 48 }}
          >
            {/* Helm */}
            <div
              style={{
                width: 26,
                height: 26,
                background: "#7c3aed",
                borderRadius: "50%",
                margin: "0 auto 2px",
                position: "relative",
              }}
            >
              {/* Visor */}
              <div
                style={{
                  width: 14,
                  height: 10,
                  background: "#60a5fa",
                  borderRadius: 4,
                  position: "absolute",
                  top: 8,
                  left: 6,
                }}
              />
            </div>

            {/* Badan */}
            <div
              style={{
                width: 28,
                height: 32,
                background: "#ede9fe",
                borderRadius: 8,
                margin: "0 auto",
                position: "relative",
              }}
            >
              {/* Tangan kiri */}
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  top: 6,
                  width: 10,
                  height: 5,
                  background: "#ede9fe",
                  borderRadius: 3,
                  transform: "rotate(20deg)",
                }}
              />
              {/* Tangan kanan */}
              <div
                style={{
                  position: "absolute",
                  right: -10,
                  top: 6,
                  width: 10,
                  height: 5,
                  background: "#ede9fe",
                  borderRadius: 3,
                  transform: "rotate(-20deg)",
                }}
              />
              {/* Kaki kiri */}
              <div
                style={{
                  position: "absolute",
                  left: 4,
                  bottom: -8,
                  width: 8,
                  height: 10,
                  background: "#ede9fe",
                  borderRadius: 3,
                }}
              />
              {/* Kaki kanan */}
              <div
                style={{
                  position: "absolute",
                  right: 4,
                  bottom: -8,
                  width: 8,
                  height: 10,
                  background: "#ede9fe",
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        </div>

        {/* Teks */}
        <h1 className="text-7xl font-medium tracking-tight leading-none mb-2">
          404
        </h1>
        <h2 className="text-xl font-medium mb-2">Halaman tidak ditemukan</h2>
        <p className="text-muted-foreground text-center max-w-xs leading-relaxed mb-8">
          Sepertinya halaman yang kamu cari sudah melayang ke luar angkasa.
          Kembali ke halaman utama yuk!
        </p>

        {/* Tombol */}
        <div className="flex gap-3">
          <a
            href="/dashboard"
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary transition"
          >
            Kembali ke Dashboard
          </a>
          <a
            href="javascript:history.back()"
            className="px-5 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition"
          >
            Kembali
          </a>
        </div>
      </div>
    </>
  );
}
