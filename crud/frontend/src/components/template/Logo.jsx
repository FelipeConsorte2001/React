import React from"react";
import logo from '../../assets/logo.svg'
import "./Logo.css"

export default props => 
    <aside className="logo">
        <a href="/" className="logo">
            <img src={logo} alt="logo"/>
        </a>
    </aside>