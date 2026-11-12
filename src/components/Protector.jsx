import { Component } from 'react';

/** Si una pantalla falla, muestra un mensaje amable en lugar de una pantalla en blanco. */
export default class Protector extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="fixed inset-0 grid place-items-center bg-[#0f3b4f] p-6">
        <div className="panel max-w-sm p-6 text-center">
          <p className="text-2xl font-extrabold">¡Uy! Algo se enredó.</p>
          <p className="mt-2 font-bold">No es tu culpa. Volvamos al mapa y sigamos jugando.</p>
          <button
            type="button"
            className="btn btn-verde btn-grande mt-4"
            onClick={() => {
              this.setState({ error: null });
              this.props.onReiniciar?.();
            }}
          >
            Volver al mapa
          </button>
        </div>
      </div>
    );
  }
}
