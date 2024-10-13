import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

// define o estado inicial dos dispositivos
let dispositivos = {
    luzSalaOn: false,
    luzCozinhaOn: false,
    luzQuartoOn: false,
    televisaoOn: false,
    televisaoCanal: '1',
    arOn: false,
    arTemp: 24,
    geladeiraOn: false,
    geladeiraTemp: 4,
    fogaoOn: false,
    fogaoPotencia: 1,
    ventiladorOn: false,
    ventiladorVel: 1,
    cortinaOn: false
};

io.on('connection', (socket) => {
    console.log('Cliente conectado', socket.id);

    // envia o estado inicial dos dispositivos para o cliente
    socket.emit('estadoInicial', dispositivos);

    // lida com eventos de alteração no estado dos dispositivos e envia as atualizações para todos os clientes conectados
    socket.on('acenderLuzSala', () => {
        dispositivos.luzSalaOn = !dispositivos.luzSalaOn; // alterna o estado da luz
        io.emit('estadoAltera', dispositivos); // emite o novo estado para todos os clientes
      });
    
      socket.on('acenderLuzCozinha', () => {
        dispositivos.luzCozinhaOn = !dispositivos.luzCozinhaOn;
        io.emit('estadoAltera', dispositivos);
      });
    
      socket.on('acenderLuzQuarto', () => {
        dispositivos.luzQuartoOn = !dispositivos.luzQuartoOn;
        io.emit('estadoAltera', dispositivos);
      });

    socket.on('ligarTelevisao', () => {
        dispositivos.televisaoOn = !dispositivos.televisaoOn;
        io.emit('estadoAltera', dispositivos);
    });

    socket.on('mudarCanalTelevisao', (novoCanal) => {
        dispositivos.televisaoCanal = novoCanal;
        io.emit('estadoAltera', dispositivos);
    });

    socket.on('ligarAr', () => {
        dispositivos.arOn = !dispositivos.arOn;
        io.emit('estadoAltera', dispositivos);
    });

    socket.on('ajustarTempAr', (novaTemp) => {
        dispositivos.arTemp = novaTemp;
        io.emit('estadoAltera', dispositivos);
    });

    socket.on('ligarGeladeira', () => {
        dispositivos.geladeiraOn = !dispositivos.geladeiraOn;
        io.emit('estadoAltera', dispositivos);
    });

    socket.on('ajustarTempGeladeira', (novaTemp) => {
        dispositivos.geladeiraTemp = novaTemp;
        io.emit('estadoAltera', dispositivos);
    });

    socket.on('acenderFogao', () => {
        dispositivos.fogaoOn = !dispositivos.fogaoOn;
        io.emit('estadoAltera', dispositivos);
    });

    socket.on('ajustarPotFogao', (novaPot) => {
        dispositivos.fogaoPotencia = novaPot;
        io.emit('estadoAltera', dispositivos);
    });

    socket.on('ligarVentilador', () => {
        dispositivos.ventiladorOn = !dispositivos.ventiladorOn;
        io.emit('estadoAltera', dispositivos);
    });

    socket.on('ajustarVelVentilador', (novaVel) => {
        dispositivos.ventiladorVel = novaVel;
        io.emit('estadoAltera', dispositivos);
    });

    socket.on('abrirCortina', () => {
        dispositivos.cortinaOn = !dispositivos.cortinaOn;
        io.emit('estadoAltera', dispositivos);
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});