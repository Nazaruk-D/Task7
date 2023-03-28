import React, {FC, useEffect} from 'react';
// import {useFormik} from "formik";
// import {useAppSelector} from "../../../store/store";
//
//
// type SendFormModalPropsType = {
//     ws: WebSocket | null
//     openModal: boolean
//     setOpenModal: (openModal: boolean) => void
// }
//
// const SendFormModal: FC<SendFormModalPropsType> = ({openModal, setOpenModal, ws}) => {
//     // const userName = useAppSelector(selectorNameUser)
//     // const users = useAppSelector(selectorFetchUsersName)
//     // const classes = useStyles();
//
//     const formik = useFormik({
//         initialValues: {
//             recipient: '',
//             subject: '',
//             message: '',
//         },
//         validate: (values) => {
//             const errors: ErrorType = {}
//             if (!values.recipient) {
//                 errors.recipient = 'Recipient Required'
//             }
//             if (values.recipient.length > 20) {
//                 errors.recipient = 'Name cannot be longer than 20 characters'
//             }
//             if (!values.subject) {
//                 errors.subject = 'Subject Required'
//             }
//             if (values.subject.length > 40) {
//                 errors.subject = 'Subject length must not exceed 40 characters'
//             }
//             if (values.message.length > 140) {
//                 errors.message = 'Message length should not exceed 140 characters'
//             }
//             if (!values.message) {
//                 errors.message = 'Message Required'
//             }
//             return errors
//         },
//         onSubmit: values => {
//             const newObj = {
//                 senderName: userName,
//                 recipientName: values.recipient,
//                 subject: values.subject,
//                 message: values.message
//             }
//             ws!.send(JSON.stringify({action: 'sendMessage', userName, newObj}))
//             setOpenModal(false)
//             formik.resetForm()
//         },
//     })
//
//     useEffect(() => {
//     }, [formik.values.recipient])
//
//     const handleClose = () => {
//         setOpenModal(false);
//     };
//
//     return (
//         <div>
//
//         </div>
//         // <Modal open={openModal} onClose={handleClose} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
//         //     <div className={classes.paper}>
//         //         <Typography variant="h5" gutterBottom>
//         //             Send email form
//         //         </Typography>
//         //         <form onSubmit={formik.handleSubmit}>
//         //             <Grid container spacing={2}>
//         //                 <Grid item xs={12}>
//         //                     <Autocomplete
//         //                         options={users}
//         //                         filterSelectedOptions
//         //                         value={formik.values.recipient}
//         //                         onChange={(event, value) => formik.setFieldValue('recipient', value)}
//         //                         renderInput={(params) => (
//         //                             <TextField
//         //                                 {...params}
//         //                                 fullWidth
//         //                                 className={classes.textField}
//         //                                 label="Autocomplete"
//         //                                 variant="outlined"
//         //                                 {...formik.getFieldProps('recipient')}
//         //                             />
//         //                         )}
//         //                     />
//         //                     {formik.touched.recipient && formik.errors.recipient &&
//         //                         <div style={{color: "red"}}>{formik.errors.recipient}</div>}
//         //                 </Grid>
//         //                 <Grid item xs={12}>
//         //                     <TextField
//         //                         fullWidth
//         //                         label="Subject"
//         //                         variant="outlined"
//         //                         className={classes.textField}
//         //                         {...formik.getFieldProps('subject')}
//         //                     />
//         //                     {formik.touched.subject && formik.errors.subject &&
//         //                         <div style={{color: "red"}}>{formik.errors.subject}</div>}
//         //                 </Grid>
//         //                 <Grid item xs={12}>
//         //                     <TextField
//         //                         fullWidth
//         //                         label="Message"
//         //                         variant="outlined"
//         //                         multiline
//         //                         rows={4}
//         //                         className={classes.textField}
//         //                         {...formik.getFieldProps('message')}
//         //                     />
//         //                     {formik.touched.message && formik.errors.message &&
//         //                         <div style={{color: "red"}}>{formik.errors.message}</div>}
//         //                 </Grid>
//         //                 <Grid item xs={12}>
//         //                     <Button
//         //                         type="submit"
//         //                         variant="contained"
//         //                         color="primary"
//         //                         className={classes.button}
//         //                         endIcon={<SendIcon/>}
//         //                         disabled={!(formik.isValid && formik.dirty)}
//         //                     >
//         //                         Send
//         //                     </Button>
//         //                 </Grid>
//         //             </Grid>
//         //         </form>
//         //     </div>
//         // </Modal>
//     );
// }
//
// export default SendFormModal;
//
// // const useStyles = makeStyles((theme: Theme) => ({
// //     paper: {
// //         position: 'absolute',
// //         width: 500,
// //         backgroundColor: theme.palette.background.paper,
// //         boxShadow: theme.shadows[5],
// //         padding: theme.spacing(2, 4, 3),
// //         outline: 'none',
// //     },
// //     textField: {
// //         marginBottom: theme.spacing(2),
// //     },
// //     button: {
// //         marginTop: theme.spacing(2),
// //     },
// // }));
//
// type ErrorType = {
//     recipient?: string
//     subject?: string
//     message?: string
// }
//
