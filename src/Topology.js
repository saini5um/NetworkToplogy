import { useState, useEffect } from 'react';
import Graph from './GraphImage.js';
import States from './IndiaStates.json';

export default function Topology() {
    const [data, setData] = useState();
    const [services, setServices] = useState([]);
    const [circle, setCircle] = useState('GUJ');
    const [service, setService] = useState('1461327183');
    const [dataFetched, setDataFetched] = useState(false);
    const STATES = States;
    let graphRender;
    const imgprefix = "https://nltd.s3.amazonaws.com/topology/";

    const ImageMap = {
        "4G_TDD": "ran.png",
        "4G": "ran.png",
        "3G": "ran.png",
        "2G": "ran.png",
        "TX-MW": "microwave.png",
        "TX-OP": "optics.png",
        "TX-Optics": "optics.png",
        "IP/MPLS": "router.png",
        "CEN": "optics.png",
        "IPCPE": "router.png",
        "MME": "pscore.png"
    };

    const ServiceTypeMap = {
        "Physical": "orange",
        "Logical": "blue"
    };

    if ( dataFetched ) {
        console.log("data was fetched! Now going to render the graph");
        console.log(data);
        graphRender = <Graph graph={data}/>
    } else {
        graphRender = <p></p>
    }

    const handleSelect=(e) => {
//        console.log(e);
        setService(e.target.value);
//        fetchServiceData(e.target.value);
    }

    const handleSelectService=(e) => {
        console.log(e);
        setService(e.target.value);
    }

    const fetchServiceData = selectedCircle => {
        console.log(`attempting to fetch data for circle ${selectedCircle}`);
//        fetch(`http://phx-0008.snphxprshared1.gbucdsint02phx.oraclevcn.com:3005/getservice/${service}`)
        fetch(`http://localhost:3005/getservices/${selectedCircle}`)
        .then(res => res.json())
        .then(data => {
            const masterServices = [];
            data.forEach(row => {
                let masterserviceid = row["MASTERSERVICEID"];
//                console.log("masterserviceid=" + masterserviceid);
                masterServices.push(masterserviceid);
            });
            setServices(masterServices);
        });
    }

    const fetchData = e => {
//        console.log(`service is ${service}`);
//        fetch(`http://phx-0008.snphxprshared1.gbucdsint02phx.oraclevcn.com:3005/getservice/${service}`)
        fetch(`http://localhost:3005/getservice/${service}`)
        .then(res => res.json())
        .then(data => {
            const nodes = [];
            const links = [];
            const node_arr = [];
            data.forEach(row => {
                let aendnodeid = row["AENDNODENAME"];
                let aendport = row["AENDPARENTPORT"];
                let zendnodeid = row["ZENDNODENAME"];
                let zendport = row["ZENDPARENTPORT"];

                if ( aendport === undefined ) {
                    [aendnodeid, aendport] = aendnodeid.split("/");
                }

                if ( zendport === undefined ) {
                    [zendnodeid, zendport] = zendnodeid.split("/");
                }
                console.log("anode=" + aendnodeid + " port=" + aendport);
                console.log("znode=" + zendnodeid + " port=" + zendport);

                if ( !node_arr.includes(aendnodeid) ) {
                    node_arr.push(aendnodeid);
                    nodes.push({
                    "id": aendnodeid,
                    "name": aendnodeid,
                    "port": aendport,
                    "type": imgprefix+ImageMap[row["AENDTECHNOLOGY"]]
                    });
                }
                if ( !node_arr.includes(zendnodeid) ) {
                    node_arr.push(zendnodeid);
                    nodes.push({
                    "id": zendnodeid,
                    "name": zendnodeid,
                    "port": zendport,
                    "type": imgprefix+ImageMap[row["ZENDTECHNOLOGY"]]
                    });
                }
                if ( row["LINKROLE"] != "RAN-CEN" ) {
                    links.push({
                    "source": aendnodeid,
                    "target": zendnodeid,
                    "value" : "1",
                    "linkType": row["LINKROLE"],
                    "serviceType": ServiceTypeMap["Logical"]
                  });
                }
            });
            let gp = {};
            gp.nodes = nodes;
            gp.links = links;
            console.log(gp);
            setData(gp);
            setDataFetched(true);
        });
    }

    useEffect(() => {
        console.log("Use effects was called!");
//        fetchServiceData('GUJ');
        fetchData();
    }, []);

    const gdata = {nodes:[{"id": "A", "name":"AN"}, {"id": "B", "name":"MEA"}, {"id": "C", "name":"MES"}, {"id": "D", "name":"PE"}], 
    links:[{"source": "A", "target": "B", "value": "1"},
        {"source": "B", "target": "C", "value": "2"},
        {"source": "C", "target": "D", "value": "3"}
    ]};

    return (
        <div className="App-default">
            <label htmlFor="Circle">Circle:</label>

            <select className="App-default" value={circle} onChange={handleSelect} name="state" id="state">
            {STATES.map((state) => (
                <option value={state.id}>{state.display}</option>
            ))}
            </select>
            <label htmlFor="Service">Service:</label>
            <input className="App-input" onChange={handleSelect} name={service} id="service"></input>
            <button className="App-button" onClick={fetchData}>
                Fetch Topology
            </button>
            {graphRender}
        </div>
    );
}
