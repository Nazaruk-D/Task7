import React, {ChangeEvent} from 'react';
// @ts-ignore
import s from "../ModalGeneralStyle.module.scss"
import Modal from "../Modal";
import {useFormik} from "formik";
import {useAppDispatch} from "../../../../store/store";


type EditEmailModalPropType = {
    setModalActive: (modalActive: boolean) => void
    hide: () => void
    onChangeHandler: (roomNumber: string) => void
}

const SettingsGame: React.FC<EditEmailModalPropType> = ({setModalActive, hide, onChangeHandler}) => {

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