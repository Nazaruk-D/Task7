import React from "react";
import s from "./LoginForm.module.scss"
import {useFormik} from "formik";
import {useAppDispatch} from "../../../../store/store";
import {routes} from "../../../../routes/routes";
import {useNavigate} from "react-router-dom";
import {setUserName} from "../../../../store/reducers/app-reducer";
import Button from "../../../../common/component/Button/Button";


const LoginForm = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validate: (values) => {
            const errors: { name?: string } = {}
            if (!values.name) {
                errors.name = 'Name Required'
            }
            if (values.name.length > 20) {
                errors.name = 'Name must not be longer than 20 characters'
            }
            return errors
        },
        onSubmit: values => {
            dispatch(setUserName(values.name))
            navigate(routes.mainPage)
            formik.resetForm()
        },
    })

    return (
        <div className={s.loginContainer}>
            <div className={s.loginBlock}>
                <form onSubmit={formik.handleSubmit} className={s.form}>
                    <h1 className={s.title}>Enter your name</h1>
                    <input
                        placeholder="name"
                        className={s.input}
                        {...formik.getFieldProps('name')}
                    />
                    {formik.touched.name && formik.errors.name &&
                        <div style={{color: "red"}}>{formik.errors.name}</div>}
                    <Button disabled={!(formik.isValid && formik.dirty)} className={s.button}>Login</Button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;