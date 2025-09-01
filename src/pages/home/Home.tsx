import React from "react";
import './Home.scss'
import { Button } from "@mantine/core";
import question from '../../assets/Account.svg'
import { Link } from "react-router-dom";

const Home: React.FC = () => {

    return(
        <div className="home-page">
            <div className="nav">
                <div className="nav-icon">
                    <img src={question} alt="Account" />
                </div>
                <div className="nav-buttons">
                <Button component={Link} to={"login"}>Login</Button>                    
                <Button component={Link} to={"sign-up"}>Sign up</Button>                    
                </div>

            </div>
        </div>
    )
}

export default Home;