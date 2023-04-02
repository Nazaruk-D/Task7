import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../../store/store";
import {selectorNameUser} from "../../../store/selector/selectorApp";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../routes/routes";
import {useFormik} from "formik";
import {setUserName} from "../../../store/reducers/app-reducer";
import s from "./Login.module.scss";
import Button from "../../../common/component/Button/Button";


const Login = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const userName = useAppSelector(selectorNameUser)

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

    useEffect(() => {
        if (userName) navigate(routes.mainPage)
    }, [userName, navigate])

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

export default Login;