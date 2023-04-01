import React, {FC} from 'react';
import s from "./YourNumber.module.scss";

type YourNumberPropsType = {
    yourNumber: number[] | null
}

const YourNumber: FC<YourNumberPropsType> = ({yourNumber}) => {
    return (<>
            {yourNumber && <div className={s.yourNumber}>Your number: <span className={s.number}>{yourNumber}</span></div>}
        </>
    );
};

export default YourNumber;