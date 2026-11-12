import Hud from '../components/Hud.jsx';
import { TACHOS } from '../data/tachos.js';
import { NIVELES, CAPITULOS } from '../data/niveles.js';

export default function ParaProfes({ ir, params }) {
  return (
    <div className="min-h-[100dvh] bg-[#fff6e5] pb-10">
      <div className="bg-gradient-to-b from-[#1d6a92] to-[#2a8bbf]">
        <div className="max-w-3xl mx-auto">
          <Hud titulo="Para profes y familias" onVolver={() => ir(params?.desde || 'inicio')} />
        </div>
        <div className="tejido h-3" />
      </div>
      <article className="max-w-3xl mx-auto px-4 mt-5 space-y-5 text-[1.05rem] leading-relaxed">
        <section className="panel p-5">
          <h2 className="text-2xl font-extrabold mb-1">¿Qué aprende el niño?</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>A separar residuos con el <b>código de colores peruano</b> de 4 tachos.</li>
            <li>A tener una idea <b>aproximada</b> de cuánto tarda cada residuo en desaparecer.</li>
            <li>Ideas sencillas para <b>reutilizar</b> y reciclar.</li>
            <li>A reconocer <b>residuos peligrosos</b> y a <b>pedir ayuda a un adulto</b>.</li>
            <li>Valores: cuidado del agua, trabajo en equipo, empatía (Wari ayuda a Ch'ura en vez de pelear).</li>
          </ul>
          <p className="mt-2">
            Wari nunca culpa al niño: si se equivoca, recibe una pista y vuelve a intentar. Siempre se termina el nivel; no hay castigos ni rachas que se pierden.
          </p>
        </section>

        <section className="panel p-5">
          <h2 className="text-2xl font-extrabold mb-2">La aventura: 5 capítulos, 10 niveles</h2>
          <ol className="space-y-2">
            {CAPITULOS.map((c) => (
              <li key={c.n}>
                <b>
                  Capítulo {c.n} · {c.nombre}
                </b>
                <ul className="list-disc pl-6">
                  {NIVELES.filter((n) => n.cap === c.n).map((n) => (
                    <li key={n.n}>
                      Nivel {n.n} · {n.nombre}: {n.instruccion}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="panel p-5">
          <h2 className="text-2xl font-extrabold mb-2">Código de colores</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {TACHOS.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-2xl p-3 text-white" style={{ background: t.color }}>
                <img src={t.img} alt="" className="h-14 w-auto shrink-0 bg-white/90 rounded-xl p-1" />
                <div>
                  <p className="font-extrabold">
                    {t.nombre} · {t.sub}
                  </p>
                  <p className="text-sm">{t.que}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-5">
          <h2 className="text-2xl font-extrabold mb-1">Sobre los tiempos</h2>
          <p>
            Los tiempos de descomposición son <b>valores aproximados de divulgación</b>. Cambian según el clima, el sol, el agua y el material. Por eso el juego
            siempre dice “aprox.” y usa frases como “unos días” o “cientos de años”.
          </p>
        </section>

        <section className="panel p-5">
          <h2 className="text-2xl font-extrabold mb-1">Privacidad y cámara</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>La cámara (nivel 8) se usa solo si el niño la activa y el navegador da permiso.</li>
            <li>
              Las imágenes se analizan <b>dentro del dispositivo</b> con MobileNet (TensorFlow.js). <b>Ninguna imagen se guarda ni se envía</b> por internet.
            </li>
            <li>La primera vez se descarga el modelo (necesita internet). Sin cámara o sin internet, el nivel se juega eligiendo el residuo a mano.</li>
            <li>No hay registro, ni anuncios, ni analítica. El avance se guarda solo en este navegador.</li>
            <li>Las ilustraciones del juego fueron creadas con inteligencia artificial para este proyecto educativo.</li>
          </ul>
        </section>

        <section className="panel p-5">
          <h2 className="text-2xl font-extrabold mb-1">Ideas para el aula</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Juegue en proyector: los niños pasan al frente por turnos.</li>
            <li>Después del nivel 8, armen en el aula los 4 tachos con cajas pintadas.</li>
            <li>Lleven pilas usadas, con un adulto, a un punto de acopio del distrito.</li>
          </ul>
          <p className="mt-2 text-sm text-stone-600">
            Palabras en quechua: allinmi (está bien), sulpayki (gracias), qocha (laguna), haku (vamos), kusa (genial), achachaw (¡ay!), tupananchiskama (hasta pronto).
          </p>
        </section>
      </article>
    </div>
  );
}
