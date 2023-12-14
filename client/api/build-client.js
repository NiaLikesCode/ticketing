import axios from 'axios';

export default ({ req }) => {
    if (typeof window === 'undefined') {
        /* we are on the server!
        requests should be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
        to find out what this is for future projects 
        do this steps
        the structure is always http://SERVICENAME.NAMESPACE.svc.cluster.local 
        to get the namespace
        cmd: kubectl get namespace
        to get the service in that namespace
        cmd: kubectl get services -n {namespace}
        */
        return axios.create({
            // local testing
            //baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            // prod
            baseURL: 'http://ticketing.niaashleyporter.com/',
            headers: req.headers
        });
    } else {
        // we are in the browser!
        // requests made with the base url of ''
        return axios.create({
            baseURL: '/'
        });

    }
}