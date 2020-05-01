import React, { useReducer } from 'react';
// eslint-disable-next-line
import Chart from '../node_modules/chart.js/dist/Chart.bundle';
import './bootstrap.min.css';
import './index.css';

import { useCovidEstimator } from './customHooks';
import { Bar } from 'react-chartjs-2';
import { useState } from 'react';


function App() {
  const covidEstimatorReducer = (state, action) => {
    switch (action.type) {
      case 'ESTIMATE':
        return { ...action.data };
      case 'ESTIMATING':
        return { ...state, estimating: action.estimating }
      case 'ADD_VALUES':
        return { ...state, ...action.data }

      default:
        return state;
    }
  }

  const [data, dispatchPostData] = useReducer(covidEstimatorReducer,
    {
      fetching: false,
      reportedCases: '',
      population: '',
      periodType: '',
      timeToElapse: '',
      region: '',
      totalHospitalBeds: '',
      avgDailyIncomePopulation: '',
      avgDailyIncomeInUSD: ''
    });

  const handleSubmit = (event) => {
    event.preventDefault();
    // input values
    const reportedCases = document.getElementById('reportedCases').value;
    const population = document.getElementById('population').value;
    const periodType = document.getElementById('periodType').value;
    const timeToElapse = document.getElementById('timeToElapse').value;
    const region = document.getElementById('region').value;
    const totalHospitalBeds = document.getElementById('totalHospitalBeds').value;
    const avgDailyIncomePopulation = document.getElementById('avgDailyIncomePopulation').value;
    const avgDailyIncomeInUSD = document.getElementById('avgDailyIncomeInUSD').value;
    // input values arrays
    const validationArray = [reportedCases, population, periodType, timeToElapse, region, totalHospitalBeds, avgDailyIncomePopulation,
      avgDailyIncomeInUSD];

    if (validationArray.includes('')) {
      document.getElementById('validationDiv').classList.remove('d-none');
      return;
    }
    document.getElementById('validationDiv').classList.add('d-none');
    // set data values
    dispatchPostData({
      type: 'ADD_VALUES', data: {
        reportedCases,
        population,
        periodType,
        timeToElapse,
        totalHospitalBeds,
        region: {
          name: region,
          avgDailyIncomePopulation: (avgDailyIncomePopulation / 100),
          avgDailyIncomeInUSD
        }
      }
    })

  }

  // chart props
  const [chartData, setChartData] = useState({

    datasets: [
      {
        data: []
      }
      , {
        data: []
      }]

  })
  const [chartOptions, setChartOptions] = useState({});
  // using covid estimator
  useCovidEstimator(data, dispatchPostData, setChartData, setChartOptions);


  return (
    <div className='container'>
      <div className="row d-flex m-4 justify-content-center">
        <h2 className="text-center"> COVID19 ESTIMATOR </h2>
      </div>
      <div className="row d-none" id="outputChart" tabIndex="0">
        <Bar
          data={chartData}
          options={chartOptions}
        />
      </div>
      <div className="d-none d-md-none bg-light" id="sm-output" tabIndex="0">
        <table className="table table-responsive table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Impact</th>
              <th>Severe Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Currently Infected</td>
              <td>{chartData.datasets[0].data[0]}</td>
              <td>{chartData.datasets[1].data[0]}</td>
            </tr>
            <tr>
              <td>Infections By Requested Time</td>
              <td>{chartData.datasets[0].data[1]}</td>
              <td>{chartData.datasets[1].data[1]}</td>
            </tr>
            <tr>
              <td>Severe Cases By Requested Time</td>
              <td>{chartData.datasets[0].data[2]}</td>
              <td>{chartData.datasets[1].data[2]}</td>
            </tr>
            <tr>
              <td>Hospital Beds By Requested Time</td>
              <td>{chartData.datasets[0].data[3]}</td>
              <td>{chartData.datasets[1].data[3]}</td>
            </tr>
            <tr>
              <td>Cases For ICU By Requested Time</td>
              <td>{chartData.datasets[0].data[4]}</td>
              <td>{chartData.datasets[1].data[4]}</td>
            </tr>
            <tr>
              <td>Cases For Ventilators By Requested Time</td>
              <td>{chartData.datasets[0].data[5]}</td>
              <td>{chartData.datasets[1].data[5]}</td>
            </tr>
            <tr>
              <td>Dollars In Flight</td>
              <td>{chartData.datasets[0].data[6]}</td>
              <td>{chartData.datasets[1].data[6]}</td>
            </tr>
          </tbody>
        </table>

      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="d-none text-center" id="validationDiv">
          <label className="text-danger">Fill all form input fields!!!</label>
        </div>
        <div className="form-group row">
          <div className="col-6">
            <label htmlFor="reportedCases">Reported Cases</label>
            <input type="number" id="reportedCases" data-reported-cases="" className="form-control" required></input>
          </div>
          <div className="col-6">
            <label htmlFor="population">Population Size</label>
            <input type="number" data-population="" id="population" className="form-control" required></input>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-6">
            <label htmlFor="periodType">Period Type</label>
            <select id="periodType" data-period-type="" className="form-control" required>
              <option value="days" name="days">days</option>
              <option value="weeks" name="weeks">weeks</option>
              <option value="months" name="months">months</option>
            </select>
          </div>
          <div className="col-6">
            <label htmlFor="timeToElapse">Time to Elapse</label>
            <input type="number" id="timeToElapse" data-time-to-elapse="" className="form-control" required></input>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-4">
            <label htmlFor="region">Region</label>
            <input id="region" type="text" className="form-control" required></input>
          </div>
          <div className="col-8">
            <label htmlFor="totalHospitalBeds">Total Hospital Beds</label>
            <input type="number" id="totalHospitalBeds" data-total-hospital-beds="" className="form-control" required></input>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-10 offset-1">
            <label htmlFor="avgDailyIncomePopulation">Average Daily Income Population</label>
            <div className="input-group">
              <input type="number" max={100} id="avgDailyIncomePopulation" className="form-control" required></input>
              <div className="input-group-append">
                <div className="input-group-text">%</div>
              </div>
              <div className="invalid-feedback">
                A percentage cannot be greater than 100 or less than 0.
              </div>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-10 offset-1">
            <label htmlFor="avgDailyIncomeInUSD">Average Daily Income In USD</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  $
                </div>
              </div>
              <input type="number" step="any" min="0.00" id="avgDailyIncomeInUSD" data-avg-daily-income-in-usd="" className="form-control" required></input>
            </div>
          </div>
        </div>
        <div className="form-group row d-flex justify-content-center">
          <button type="submit" data-go-estimate="" className="btn btn-primary ">GO Estimate</button>
        </div>
      </form>
    </div>
  );
}

export default App;
