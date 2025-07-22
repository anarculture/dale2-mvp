import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import AutocompleteInput from '../components/AutocompleteInput';
import { ShieldCheck, Zap, Tag, Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

const Home: NextPage = () => {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/trips?origin=${origin}&destination=${destination}&departureDate=${date}&passengers=${passengers}`);
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="relative bg-blue-500 text-white">
        <div 
          className="absolute inset-0 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-background.svg')" }}
        ></div>
        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:px-6 lg:px-8 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center">Miles de viajes al mejor precio</h1>
          <div className="mt-8 max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-lg">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 items-center rounded-lg shadow-sm border border-gray-300">
                <AutocompleteInput
                  value={origin}
                  onValueChange={setOrigin}
                  placeholder="Saliendo desde..."
                  className="w-full p-3 border-r border-gray-300 rounded-l-lg focus:outline-none text-gray-800"
                />
                <AutocompleteInput
                  value={destination}
                  onValueChange={setDestination}
                  placeholder="Hacia..."
                  className="w-full p-3 border-r border-gray-300 focus:outline-none text-gray-800"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border-r border-gray-300 focus:outline-none text-gray-800"
                />
                <input
                  type="number"
                  min="1"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  placeholder="1 pasajero"
                  className="w-full p-3 focus:outline-none text-gray-800 rounded-r-lg"
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 font-semibold h-full">Buscar</button>
            </form>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <Tag className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold">Miles de viajes al mejor precio</h3>
              <p className="mt-2 text-gray-600">Dondequiera que vayas, encuentra tu viaje ideal a un precio muy bajo.</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold">Viaja con confianza</h3>
              <p className="mt-2 text-gray-600">Nos aseguramos de conocer a cada uno de nuestros miembros. Verificamos perfiles, calificaciones e identificaciones para que sepas con quién viajas.</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold">¡Desplázate, haz clic y listo!</h3>
              <p className="mt-2 text-gray-600">¡Reservar un viaje nunca ha sido tan fácil! Gracias a nuestra sencilla aplicación impulsada por gran tecnología, puedes reservar un viaje cercano en cuestión de minutos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scams Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              {/* Placeholder for illustration */}
              <div className="bg-gray-200 h-64 w-full rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Ilustración</span>
              </div>
            </div>
            <div className="order-1 md:order-2 text-center md:text-left">
              <h2 className="text-3xl font-bold">Ayúdanos a protegerte de estafas</h2>
              <p className="mt-4 text-gray-600">En Dale, nos esforzamos por hacer nuestra plataforma lo más segura posible. Pero cuando ocurre una estafa, queremos que sepas exactamente cómo evitarla y reportarla. Sigue nuestros consejos y ayúdanos a protegerte.</p>
              <button className="mt-6 bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900">Más información</button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Drive CTA Section */}
      <section className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold">¿A dónde quieres conducir?</h2>
              <p className="mt-4 text-lg">Hacemos este viaje más económico para ti.</p>
              <button onClick={() => router.push('/trips/new')} className="mt-6 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600">Publicar un viaje</button>
            </div>
            <div>
              {/* Placeholder for illustration */}
              <div className="bg-gray-700 h-64 w-full rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Ilustración</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">¿A dónde quieres viajar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => router.push('/trips?origin=Caracas&destination=Maracaibo')} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow">
              <p className="font-semibold">Caracas → Maracaibo</p>
            </div>
            <div onClick={() => router.push('/trips?origin=Maracaibo&destination=Caracas')} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow">
              <p className="font-semibold">Maracaibo → Caracas</p>
            </div>
            <div onClick={() => router.push('/trips?origin=Caracas&destination=Valencia')} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow">
              <p className="font-semibold">Caracas → Valencia</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <a href="/trips" className="text-blue-500 font-semibold hover:underline">Ver nuestros viajes más populares</a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-800 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Preguntas frecuentes sobre viajes compartidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h4 className="font-bold mb-2">¿Cómo reservo un viaje en un coche compartido?</h4>
              <p className="text-gray-400">Puedes reservar un viaje en un coche compartido en nuestra aplicación o sitio web. Solo busca tu destino, elige la fecha en la que quieres viajar y selecciona el viaje compartido que mejor se adapte a ti.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">¿Cómo ofrezco un viaje en un coche compartido?</h4>
              <p className="text-gray-400">Ofrecer un viaje en un coche compartido es fácil. Para publicar tu viaje, usa tu aplicación o sitio web. Indica tus puntos de salida y llegada, la fecha y hora de tu viaje.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">¿Cómo cancelo mi viaje en un coche compartido?</h4>
              <p className="text-gray-400">Si tus planes cambian, siempre puedes cancelar tu viaje desde la sección "Tus Viajes". Cuanto antes canceles, mejor.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">¿Cuáles son las ventajas de viajar en coche compartido?</h4>
              <p className="text-gray-400">Hay muchas ventajas de viajar en coche compartido. Los viajes en coche compartido suelen ser mucho más baratos que otros medios de transporte, especialmente para largas distancias.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600">Leer más en nuestro Centro de Ayuda</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Principales rutas</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Caracas → Maracaibo</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Maracaibo → Caracas</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Caracas → Valencia</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Valencia → Caracas</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Caracas → Barquisimeto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Acerca de</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">¿Cómo funciona?</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Quiénes somos</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Centro de Ayuda</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Prensa y medios</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">¡Vacantes de empleo!</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-2 flex md:justify-end">
              <div>
                <div className="border border-gray-700 rounded-md p-2 mb-4">
                  <select className="bg-transparent w-full focus:outline-none">
                    <option>Idioma - Español (Venezuela)</option>
                  </select>
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-400 hover:text-white"><Facebook /></a>
                  <a href="#" className="text-gray-400 hover:text-white"><Twitter /></a>
                  <a href="#" className="text-gray-400 hover:text-white"><Youtube /></a>
                  <a href="#" className="text-gray-400 hover:text-white"><Instagram /></a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <p className="text-base text-gray-400">&copy; 2025 Dale. Todos los derechos reservados.</p>
            <a href="#" className="mt-4 md:mt-0 text-base text-gray-400 hover:text-white">Términos y condiciones</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
