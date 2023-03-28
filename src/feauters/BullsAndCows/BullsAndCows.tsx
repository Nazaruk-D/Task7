import React from 'react';
import {Link} from "react-router-dom";
import {routes} from "../../routes/routes";

const BullsAndCows = () => {
    return (
        <div>
            <Link to={routes.mainPage}>to main menu</Link>
            BullsAndCows
        </div>
    );
};

export default BullsAndCows;