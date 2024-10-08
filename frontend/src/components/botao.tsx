import React from 'react';

interface BotaoProps {
  onClick: () => void;
  isOn: boolean;
  textOn: string;
  textOff: string;
  color: string;
}

const Botao: React.FC<BotaoProps> = ({ onClick, isOn, textOn, textOff, color }) => {
  return (
    <button onClick={onClick} className={`text-lg ${color} rounded-xl p-1`}>
      {isOn ? textOff : textOn}
    </button>
  );
};

export default Botao;
