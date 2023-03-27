import React from "react";
import s from "./Square.module.scss"

interface SquareProps {
    value: string | null;
    onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => {
    return (
        <div className={s.square} onClick={onClick}>
            {value}
        </div>
    );
};

export default Square;
