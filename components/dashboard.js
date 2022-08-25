import React, { useState, useEffect } from "react"
import axios from 'axios'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { faker } from '@faker-js/faker';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = (props) => {
    const [transaction, setTransaction] = useState([]);
    useEffect(() => {
        let deviceId = props.data;
        let url = `https://iot1.wsa.cloud/api/v1/${deviceId}/rpc`;
        let token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYXp6eXBheUBnbWFpbC5jb20iLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInVzZXJJZCI6IjkzM2E5MzEwLWIwMDQtMTFlYy1iMTQ0LWM5NjY4ZWNlM2Q4NiIsImVuYWJsZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiI4OTg1MTIwMC1iMDA0LTExZWMtYjE0NC1jOTY2OGVjZTNkODYiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2NTA0Mjk0OTUsImV4cCI6MTY1MDQzODQ5NX0.Qva-oJY4MXYSAtcb1ZEhKrZ5ssX3ututeQKwHhKBJJShecLkm1_LZEc9jnjh4ziu9Oms_KwMm4_ViVlS5msc3w";
        let payment_record = {
            method: "GET_PAYMENT_RECORD",
            params: {
                start_time: 0,
                end_time: new Date().getTime()
            }
        };
        let config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios.post(url, payment_record, config).then((res) => {
            setTransaction(res.data.params.paymentrecord);
        });
    }, [])
    let checkPayment = transaction.filter((i) => String(i.paymentstatus).toLowerCase() == 'success').sort();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let labels = months;
    let payment_value = (checkPayment.map((i) => i.paymentvalue));
    let max = payment_value[0];
    let min = payment_value[0];
    for (let i = 1; i < payment_value.length; ++i) {
        if (payment_value[i] > max) {
            max = payment_value[i];
        }
        else {
            min = payment_value[i];
        }
    }
    let maxVal = 0;
    let minVal = 0;
    if (max != undefined && max > 0) {
        maxVal += max;
    }
    if (min != undefined && min > 0) {
        minVal += min;
    }
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: null
        },
    };
    const data = {
        labels,
        datasets: [
            {
                label: "Revenue Report",
                data: labels.map(() => faker.datatype.number({ min: minVal, max: parseInt(maxVal) })),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };
    return (
        <div>
            <Line options={options} data={data} />
            <br/>
        </div>
    )
}
export default Dashboard;