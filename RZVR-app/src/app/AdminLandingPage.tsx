import React, { useState } from "react";

function AdminLandingPage() {
    const [ifLogin, setIfLogin ] = useState(false);

    return (
        <div className="login-schema">
            <button onClick={() => setIfLogin(true)} className="login-button">Logg inn</button>
            {ifLogin && (
                <form className="formlogin-schema">
                    <input placeholder="Brukernavn" className="username" />
                    <input placeholder="**********" type="password" className="password" />
                    <button className="login-button">Send inn</button>
                </form>
            )}
        </div>
    );
}

export default AdminLandingPage;