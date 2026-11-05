import Encabezado from '../components/Encabezado.jsx';
import Icono from '../components/Icono.jsx';
import { TACHOS } from '../data/tachos.js';

export default function ParaProfes({ ir }) {
  return (
    <div className="min-h-[100dvh] bg-crema pb-10">
      <div className="bg-laguna">
        <div className="max-w-3xl mx-auto">
          <Encabezado titulo="Para profes y familias" onVolver={() => ir('mapa')} />
        </div>
      </div>
      <div className="tejido h-3" />
      <article className="max-w-3xl mx-auto px-4 mt-4 space-y-5 text-[1.05rem] leading-relaxed">
        <section className="tarjeta p-4">
          <h2 className="text-2xl font-extrabold mb-1">¿Qué aprende el niño?</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>A separar residuos con el <b>código de colores peruano</b> de 4 tachos.</li>
            <li>A tener una idea <b>aproximada</b> de cuánto tarda cada residuo en desaparecer.</li>
            <li>Ideas sencillas para <b>reutilizar</b> o reciclar.</li>
            <li>A reconocer <b>residuos peligrosos</b> y pedir ayuda a un adulto.</li>
          </ul>
          <p className="mt-2">
            Wari nunca culpa al niño: si se equivoca, recibe una pista. Siempre se termina el nivel; no hay castigos ni rachas que se pierden.
          </p>
        </section>

        <section className="tarjeta p-4">
          <h2 className="text-2xl font-extrabold mb-2">Código de colores</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {TACHOS.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-2xl p-3 text-white" style={{ background: t.color }}>
                <span className="bg-white rounded-full p-1 shrink-0">
                  <Icono nombre={t.icono} size={36} />
                </span>
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

        <section className="tarjeta p-4">
          <h2 className="text-2xl font-extrabold mb-1">Sobre los tiempos</h2>
          <p>
            Los tiempos de descomposición son <b>valores aproximados de divulgación</b>. Cambian según el clima, el sol, el agua y el tipo
            exacto de material. Por eso el juego siempre dice “aprox.” y usa frases como “unos días” o “cientos de años”.
          </p>
        </section>

        <section className="tarjeta p-4">
          <h2 className="text-2xl font-extrabold mb-1">Privacidad y cámara</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>La cámara (nivel 4) se usa solo si el niño la activa y el navegador da permiso.</li>
            <li>
              Las imágenes se analizan <b>dentro del dispositivo</b> con MobileNet (TensorFlow.js). <b>Ninguna imagen se guarda ni se envía</b> por
              internet.
            </li>
            <li>La primera vez se descarga el modelo de reconocimiento (necesita internet). Si no hay cámara o internet, el nivel funciona eligiendo el residuo a mano.</li>
            <li>No hay registro, ni anuncios, ni analítica. El avance se guarda solo en este navegador.</li>
          </ul>
        </section>

        <section className="tarjeta p-4">
          <h2 className="text-2xl font-extrabold mb-1">Ideas para el aula</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Juegue en proyector: los niños pasan al frente a arrastrar.</li>
            <li>Después del nivel 4, armen en el aula los 4 tachos con cajas pintadas.</li>
            <li>Lleven pilas usadas, con un adulto, a un punto de acopio del distrito.</li>
          </ul>
          <p className="mt-2 text-sm text-stone-600">Palabras en quechua: allinmi (está bien), sulpayki (gracias), qocha (laguna), haku (vamos), kusa (genial).</p>
        </section>
      </article>
    </div>
  );
}
