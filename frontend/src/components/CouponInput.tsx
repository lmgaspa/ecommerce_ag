import React from 'react';

interface CouponInputProps {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
}

const CouponInput: React.FC<CouponInputProps> = ({ value, onChange, onApply }) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <input
        type="text"
        placeholder="Código do cupom"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 w-64 text-text-primary"
      />
      <button onClick={onApply} className="bg-accent text-background px-6 py-2 rounded-md shadow-md">
        Aplicar Cupom
      </button>
    </div>
  );
};

export default CouponInput;