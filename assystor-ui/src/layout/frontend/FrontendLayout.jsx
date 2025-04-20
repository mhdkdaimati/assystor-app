import React from 'react';
import NavbarFront from './NavbarFront';
import Footer from './Footer';
import '../../assets/admin/css/styles.css';
import '../../assets/admin/js/scripts';
import { Switch, Route } from 'react-router-dom';
import publicRouteList from '../../routes/publicRouteList';

const FrontendLayout = () =>{
    return (
        <div>
            <NavbarFront />
                <div>
                    <Switch>
                        { publicRouteList.map((routeData, idx)=>{
                            return(
                                routeData.component && (
                                    <Route 
                                    key={idx}
                                    path={routeData.path}
                                    exact={routeData.exact}
                                    name={routeData.name}
                                    render={
                                        (props)=> (
                                            <routeData.component {...props}/> 
                                        )
                                    }
                                    />
                                    )
                                )
                            }
                        )
                    }
                    </Switch>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                <Footer />
            </div>
        </div>
    );
}
export default FrontendLayout;