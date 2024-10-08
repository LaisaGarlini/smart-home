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

    socket.emit('estadoInicial', dispositivos);

    socket.on('acenderLuzSala', () => {
        dispositivos.luzSalaOn = !dispositivos.luzSalaOn;
        io.emit('estadoAltera', dispositivos);
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