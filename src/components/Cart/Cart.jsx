import React from 'react'
import { Container, Typography, Button, Grid } from '@material-ui/core'
import useStyles from './styles'
import Cartitem from './Cartitem/Cartitem';
import { Link } from 'react-router-dom'

const Cart = ({ cart, handleUpdateCartQty, handleRemoveFromCart, handleEmptyCart }) => {
    const isEmpty = !cart?.line_items?.length;  //If the cart length is more than 0 it's not empty
    const classes = useStyles()

    const EmptyCart = () => (
        <Typography variant="subtitle1">
            Opps, ou have no item in your shopping cart, start adding some!
            <Link to="/" className={classes.link}>Start adding some items</Link>!
        </Typography>
    )
    const FilledCart = () => (
        <>
        <Grid container spacing={3}>
            {cart?.line_items?.map((item) => (
                <Grid item x2={12} sm={4} key={item.id}>
                   <Cartitem item={item} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart} />
                </Grid>
            ))}
        </Grid>
        <div className={classes.cardDetails}>
            <Typography variant="h4">
                Subtotal: {cart?.subtotal?.formatted_with_symbol}
            </Typography>
            <div>
                <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Empty Cart</Button>
                <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary">Checkout</Button>
            </div>
        </div>
        </>
    )
    if(!cart.line_items) return 'Loading...'
    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h3" gutterBottom>Your Shopping Basket</Typography>
            { isEmpty ? <EmptyCart /> : <FilledCart />}
        </Container>
    )
}

export default Cart
