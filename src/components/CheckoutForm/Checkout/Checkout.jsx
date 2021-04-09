import React, {useState, useEffect} from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core'

import { commerce } from '../../../lib/commerce'
import useStyles from './styles'
import AddressForm from '../AddressForm'
import PaymentForm from '../PaymentForm'
import { Link, useHistory } from 'react-router-dom'

//Using Stepper we can show the different stages/steps we are at the payment processing stage
const steps = ['Shipping address', 'Payment details']

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0)
    const [checkoutToken, setCheckoutToken] = useState(null);
    //This is done when creating the next button
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setIsFinised] = useState(false)
    const classes= useStyles();
    const history = useHistory();

    //We are using the useEffect to get checkoutTokenId from the api
    useEffect(() => {
        //We are using a seperate function because you can't use async function directly on useEffect
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart'})
                // console.log(token);
                setCheckoutToken(token)

            } catch(error) {
                if (activeStep !== steps.length) history.push('/');
            }
        }

        generateToken()
    }, [cart]);

    //Creating a function to change the steps
    const nextStep = () => setActiveStep((previousActiveStep) => previousActiveStep + 1);
    const backStep = () => setActiveStep((previousActiveStep) => previousActiveStep - 1);

    const test = (data) => {
        setShippingData(data)

        nextStep()
    }

    //This timeout function is needed incase there is no credit card details
    const timeout = () => {
        setTimeout(() => {
            setIsFinised(true)
        }, 3000);
    }
 
    //The confirmation should show only if the order is succcessful and hence the need for order.customer
    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    ) : isFinished ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase!</Typography>
                <Divider className={classes.divider} />
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    )

    if(error) {
        <>
            <Typography variant="h5">Error: {error}</Typography>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    }

    //If activeStep = 0 we want to show the addressform instead we will show the payment form
    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} test={test} />
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} nextStep={nextStep} onCaptureCheckout={onCaptureCheckout} timeout={timeout} />

    return (
        <>
        <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {/* if we are on the last step we want to show the confirmation form */}
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>

    )
}

export default Checkout
