import React from 'react'
import { Grid } from '@material-ui/core'
import Product from './Product/Product'
import useStyles from './styles';

// const products =[
//     {id:1, name: 'shoes', description: 'Running shoes', price: '$5', image: 'https://m.media-amazon.com/images/I/61CFCujZjkL._AC_UL320_.jpg'},
//     {id:2, name: 'Macbook', description: 'Apple macbook', price: '$10', image: 'https://images-na.ssl-images-amazon.com/images/I/31Xjk0pBGUL._AC_.jpg'},
// ]

const Products = ({ products, onAddToCart }) => {
    const classes = useStyles()
    return (
        <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container justify="center" spacing={4}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <Product product={product} onAddToCart={onAddToCart} />
                    </Grid>
                ))}
            </Grid>
        </main>
    );
}

export default Products