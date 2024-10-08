import React from 'react';

interface ImagemProps {
  isOn: boolean;
  imageOn: string;
  imageOff: string;
  altOn: string;
  altOff: string;
}

const Imagem: React.FC<ImagemProps> = ({
  isOn,
  imageOn,
  imageOff,
  altOn,
  altOff,
}) => {
  return (
    <img
      src={isOn ? imageOn : imageOff}
      className={`status ${isOn ? 'on' : 'off'} w-24`}
      alt={isOn ? altOn : altOff}
    />
  );
};

export default Imagem;
