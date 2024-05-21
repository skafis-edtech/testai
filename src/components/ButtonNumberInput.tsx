interface ButtonNumberInputProps {
  value: number | undefined;
  setValue: (value: number | undefined) => void;
  min: number;
  max: number;
}

const ButtonNumberInput: React.FC<ButtonNumberInputProps> = ({
  value,
  setValue,
  min,
  max,
}) => (
  <div>
    {Array.from({ length: max - min + 1 }, (_, i) => (
      <button
        className={`num-btn transition-none ${
          value === i ? "bg-green-600 " : "bg-gray-400 hover:bg-gray-500"
        }`}
        key={i}
        onClick={() => setValue(i)}
      >
        {i}
      </button>
    ))}
  </div>
);

export default ButtonNumberInput;
