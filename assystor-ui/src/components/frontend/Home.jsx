import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Carousel from 'react-bootstrap/Carousel';



function Home(){
return(
    
    <Carousel>
        <Carousel.Item>
            <img 
            className="d-block w-100" 
            style={{height: "500px", width:"1440px"}}
            src="http://127.0.0.1:8000/uploads/product/1684396427.png"
            alt="First slide"
            />
            <Carousel.Caption style={{color: "white"}}>
            
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
            
        </Carousel.Item>
        <Carousel.Item>
            <img 
            className="d-block w-100" 
            style={{height: "500px", width:"1440px"}}
            src="http://127.0.0.1:8000/uploads/product/1684396427.png"
            alt="First slide"
            />
            <Carousel.Caption style={{color: "white"}}>
            
            <h3>First slide label 2</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
            
        </Carousel.Item>

    </Carousel>
)
}
export default Home;