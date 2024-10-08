import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import { toast } from 'sonner';
import Imagem from './components/imagem';
import Botao from './components/botao';

const socket = io('http://localhost:4000');

interface EstadoDispositivo {
  luzSalaOn: boolean;
  luzCozinhaOn: boolean;
  luzQuartoOn: boolean;
  televisaoOn: boolean;
  televisaoCanal: string;
  arOn: boolean;
  arTemp: number;
  geladeiraOn: boolean;
  geladeiraTemp: number;
  fogaoOn: boolean;
  fogaoPotencia: number;
  ventiladorOn: boolean;
  ventiladorVel: number;
  cortinaOn: boolean;
}

const App: React.FC = () => {
  const [dispositivo, setDispositivo] = useState<EstadoDispositivo>({
    luzSalaOn: false,
    luzCozinhaOn: false,
    luzQuartoOn: false,
    televisaoOn: false,
    televisaoCanal: "1",
    arOn: false,
    arTemp: 24,
    geladeiraOn: false,
    geladeiraTemp: 2,
    fogaoOn: false,
    fogaoPotencia: 1,
    ventiladorOn: false,
    ventiladorVel: 1,
    cortinaOn: false
  });

  useEffect(() => {
    socket.on('estadoInicial', (estadoDispositivos: EstadoDispositivo) => {
      setDispositivo(estadoDispositivos);
    });

    socket.on('estadoAltera', (novoEstado: EstadoDispositivo) => {
      setDispositivo(novoEstado);

      if (novoEstado.geladeiraTemp > 5) {
        toast.error('A temperatura da geladeira está acima de 5°C!');
      }
    });

    return () => {
      socket.off('estadoInicial');
      socket.off('estadoAltera');
    };
  }, []);

  const acenderLuzSala = () => socket.emit('acenderLuzSala');
  const acenderLuzCozinha = () => socket.emit('acenderLuzCozinha');
  const acenderLuzQuarto = () => socket.emit('acenderLuzQuarto');
  const ligarTelevisao = () => socket.emit('ligarTelevisao');
  const mudarCanalTelevisao = (canal: string) => socket.emit('mudarCanalTelevisao', canal);
  const ligarAr = () => socket.emit('ligarAr');
  const ajustarTempAr = (temp: number) => socket.emit('ajustarTempAr', temp);
  const ligarGeladeira = () => socket.emit('ligarGeladeira');
  const ajustarTempGeladeira = (temp: number) => socket.emit('ajustarTempGeladeira', temp);
  const acenderFogao = () => socket.emit('acenderFogao');
  const ajustarPotFogao = (potencia: number) => socket.emit('ajustarPotFogao', potencia);
  const ligarVentilador = () => socket.emit('ligarVentilador');
  const ajustarVelVentilador = (velocidade: number) => socket.emit('ajustarVelVentilador', velocidade);
  const abrirCortina = () => socket.emit('abrirCortina');

  return (
    <div className='casa h-screen overflow-y-auto overflow-x-hidden flex flex-col justify-center'>
      <div className='h-[7%] fixed top-0 w-full flex justify-center mt-2'>
        <h1 className='text-3xl bg-red-300 rounded-3xl px-2 py-1 font-semibold shadow-lg shadow-red-400'>Smart home</h1>
      </div>
      <div className='flex flex-row justify-around h-[80%] mt-11'>
        <div className='w-[28%] bg-purple-200 flex flex-col items-center justify-between rounded-3xl shadow-lg shadow-purple-400 py-3'>
          <h1 className='text-2xl font-semibold mt-1'>Sala de Estar</h1>
          <div className='luz w-full flex flex-col items-center'>
            <Botao 
              onClick={acenderLuzSala} 
              isOn={dispositivo.luzSalaOn} 
              textOn="Ligar a Luz" 
              textOff="Desligar a Luz" 
              color="bg-purple-400"
            />
            <Imagem 
              isOn={dispositivo.luzSalaOn}
              imageOn='luz.png'
              imageOff='lampada_apagada.png'
              altOn='Luz ligada'
              altOff='Luz apagada'
            />
          </div>
          <div className='luz w-full flex flex-col items-center'>
            <Botao 
              onClick={ligarTelevisao} 
              isOn={dispositivo.televisaoOn} 
              textOn="Ligar a Televisão" 
              textOff="Desligar a Televisão" 
              color="bg-purple-400"
            />
            {dispositivo.televisaoOn && (
              <div>
                <label htmlFor="canal">Canal:</label>
                <select
                  name="canal"
                  id="canal"
                  onChange={(e) => mudarCanalTelevisao(e.target.value)}
                  value={dispositivo.televisaoCanal}
                  className='rounded bg-purple-300 ml-1'
                >
                  <option value="Globo">Globo</option>
                  <option value="SBT">SBT</option>
                  <option value="Record">Record</option>
                </select>
              </div>
            )}
            <Imagem 
              isOn={dispositivo.televisaoOn}
              imageOn='televisao.png'
              imageOff='televisao_desligada.png'
              altOn='Televisão ligada'
              altOff='Televisão apagada'
            />
          </div>
          <div className='luz w-full flex flex-col items-center'>
            <Botao 
              onClick={ligarAr} 
              isOn={dispositivo.arOn} 
              textOn="Ligar o Ar Condicionado" 
              textOff="Desligar o Ar Condicionado" 
              color="bg-purple-400"
            />
            {dispositivo.arOn && (
              <div>
                <label htmlFor="tempAr">Temperatura:</label>
                <input
                  id='tempAr'
                  type="number"
                  min={18}
                  max={30}
                  value={dispositivo.arTemp}
                  onChange={(e) => ajustarTempAr(parseInt(e.target.value))}
                  className='rounded bg-purple-300 ml-1 w-10'
                />
              </div>
              )}
            <Imagem 
              isOn={dispositivo.arOn}
              imageOn='ar.png'
              imageOff='ar_desligado.png'
              altOn='Ar-condicionado ligado'
              altOff='Ar-condicionado desligado'
            />
          </div>
        </div>
        <div className='w-[28%] bg-pink-200 flex flex-col items-center justify-between rounded-3xl shadow-lg shadow-pink-400 py-3'>
          <h1 className='text-2xl font-semibold mt-1'>Cozinha</h1>
          <div className='luz w-full flex flex-col items-center'>
            <Botao 
              onClick={acenderLuzCozinha} 
              isOn={dispositivo.luzCozinhaOn} 
              textOn="Ligar a Luz" 
              textOff="Desligar a Luz"  
              color="bg-pink-400"
            />
            <Imagem 
              isOn={dispositivo.luzCozinhaOn}
              imageOn='luz.png'
              imageOff='lampada_apagada.png'
              altOn='Luz ligada'
              altOff='Luz apagada'
            />
          </div>
          <div className='luz w-full flex flex-col items-center'>
            <Botao 
              onClick={ligarGeladeira} 
              isOn={dispositivo.geladeiraOn} 
              textOn="Ligar a Geladeira" 
              textOff="Desligar a Geladeira"  
              color="bg-pink-400"
            />
            {dispositivo.geladeiraOn && (
            <div>
              <label htmlFor="tempGeladeira">Temperatura:</label>
              <input
                id='tempGeladeira'
                type="number"
                value={dispositivo.geladeiraTemp}
                onChange={(e) => ajustarTempGeladeira(parseInt(e.target.value))}
                className='rounded bg-pink-300 ml-1 w-10'
              />
            </div>
            )}
            <Imagem 
              isOn={dispositivo.geladeiraOn}
              imageOn='geladeira.png'
              imageOff='geladeira_desligada.png'
              altOn='Geladeira ligada'
              altOff='Geladeira desligada'
            />
          </div>
          <div className='luz w-full flex flex-col items-center'>
            <Botao 
              onClick={acenderFogao} 
              isOn={dispositivo.fogaoOn} 
              textOn="Ligar o Fogão" 
              textOff="Desligar o Fogão"  
              color="bg-pink-400"
            />
            {dispositivo.fogaoOn && (
            <div>
              <label htmlFor="fogaoPotencia">Potência:</label>
              <input
                name='fogaoPotencia'
                type="number"
                min={1}
                max={5}
                value={dispositivo.fogaoPotencia}
                onChange={(e) => ajustarPotFogao(parseInt(e.target.value))}
                className='rounded bg-pink-300 ml-1 w-10'
              />
            </div>
            )}
            <Imagem 
              isOn={dispositivo.fogaoOn}
              imageOn='fogao.png'
              imageOff='fogao_desligado.png'
              altOn='Fogão ligado'
              altOff='Fogão desligado'
            />
          </div>
        </div>
        <div className='w-[28%] bg-blue-200 flex flex-col items-center justify-between rounded-3xl shadow-lg shadow-blue-400 py-3'>
          <h1 className='text-2xl font-semibold mt-1'>Quarto</h1>
          <div className='luz w-full flex flex-col items-center'>
            <Botao 
              onClick={acenderLuzQuarto} 
              isOn={dispositivo.luzQuartoOn} 
              textOn="Ligar a Luz" 
              textOff="Desligar a Luz"  
              color="bg-blue-400"
            />
            <Imagem 
              isOn={dispositivo.luzQuartoOn}
              imageOn='luz.png'
              imageOff='lampada_apagada.png'
              altOn='Luz ligada'
              altOff='Luz apagada'
            />
          </div>
          <div className='luz w-full flex flex-col items-center'>
            <Botao 
              onClick={ligarVentilador} 
              isOn={dispositivo.ventiladorOn} 
              textOn="Ligar o Ventilador" 
              textOff="Desligar o Ventilador"  
              color="bg-blue-400"
            />
            {dispositivo.ventiladorOn && (
            <div>
              <label htmlFor="ventiladorVel">Velocidade:</label>
              <input
                name='ventiladorVel'
                type="number"
                min={1}
                max={3}
                value={dispositivo.ventiladorVel}
                onChange={(e) => ajustarVelVentilador(parseInt(e.target.value))}
                className='rounded bg-blue-300 ml-1 w-10'
              />
            </div>
            )}
            <Imagem 
              isOn={dispositivo.ventiladorOn}
              imageOn='ventilador.png'
              imageOff='ventilador_desligado.png'
              altOn='Ventilador ligado'
              altOff='Ventilador desligado'
            />
          </div>
          <div className='luz w-full flex flex-col items-center'>
            <Botao 
              onClick={abrirCortina} 
              isOn={dispositivo.cortinaOn} 
              textOn="Abrir Cortina" 
              textOff="Fechar Cortina"  
              color="bg-blue-400"
            />
            <Imagem 
              isOn={dispositivo.cortinaOn}
              imageOn='cortina.png'
              imageOff='cortina_fechada.png'
              altOn='Cortina aberta'
              altOff='Cortina fechada'
            />
          </div>
        </div>
      </div>
      <div className='w-full h-[2%] flex justify-center mt-4'>
        <span className='text-sm italic'>Desenvolvido por Laisa Garlini</span>
      </div>
    </div>
  );
}

export default App;