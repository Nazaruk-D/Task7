import React from 'react';
import s from "../ModalGeneralStyle.module.scss"
import Modal from "../Modal";
import {useFormik} from "formik";
import {RulesType} from "../../../types/RulesType";


type EditEmailModalPropType = {
    rules: RulesType
    setModalActive: (modalActive: boolean) => void
    hide: () => void
    onChangeHandler: (roomNumber: string) => void
}

const SettingsGame: React.FC<EditEmailModalPropType> = ({setModalActive, hide, onChangeHandler, rules}) => {

    const formik = useFormik({
        initialValues: {
            roomNumber: "",
        },
        validate: (values) => {
            const errors: {roomNumber?: string} = {};
            if (!values.roomNumber) {
                errors.roomNumber = 'Enter room number'
            }
            return errors;
        },
        onSubmit: values => {
            if (values.roomNumber) {
                onChangeHandler(values.roomNumber)
                hide()
            }
        },
    });

    return (
        <Modal setModalActive={setModalActive} hide={hide}>
            <div className={s.titleBlock}>
                <h1 className={s.title}>Settings game</h1>
            </div>
            <div className={s.rules}>
                <div className={s.title}>{rules.title}</div>
                <div className={s.enums}>Rules of the game: {rules.enumRules.map((r,i) => <div>{i+1}. {r}</div>)}</div>
                <div className={s.example}>{rules.example}</div>
            </div>
            <form onSubmit={formik.handleSubmit} className={s.form}>
                <div className={s.inputsBlock}>
                    <div className={s.inputContainer}>
                        <span className={s.label}>Room Number</span>
                        <input
                            style={formik.errors.roomNumber && formik.touched.roomNumber ? {border: `1px solid #bd1010`} : {}}
                            type={"number"}
                            {...formik.getFieldProps('roomNumber')}
                        />
                        {formik.errors.roomNumber && formik.touched.roomNumber &&
                            <span className={s.error}>{formik.errors.roomNumber}</span>}
                    </div>
                </div>
                <div className={s.buttonBlock}>
                    <button type="submit" className={s.submitButton} disabled={!(formik.isValid && formik.dirty)}>
                        Start
                    </button>
                </div>
            </form>

        </Modal>
    );
};

export default SettingsGame;