import 'bootstrap/dist/css/bootstrap.css';

import buildClient from "../api/build-client";
import Header from '../components/header';

// this is a thin wrapper to get some global css in our app
const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <div className='container'>
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>
    );
};

AppComponent.getInitialProps = async (appContext) => {
    // This is a little different from a regular component. It's special in nextJs and sends us the context in getInitialProps a little differently
    // it's nested further into the context object
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    // So without this it won't call our other components getInitialProps function so now we have to manually call it (so stupid I know)
    let pageProps = {};
    if (appContext.Component.getInitialProps) { // because this doesn't exist on every component
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);   
    }

    return {
        pageProps,
        ...data
    }
};

export default AppComponent;