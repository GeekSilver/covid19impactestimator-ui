import React, { useReducer }  from 'react';
import Chart from '../node_modules/chart.js/dist/Chart.bundle';
import './bootstrap.min.css';
import './index.css';

import { useCovidEstimator } from './customHooks';
import {Bar} from 'react-chartjs-2';
import { useState } from 'react';


function App() {
  const covidEstimatorReducer = (state, action) => {
    switch (action.type) {
      case 'ESTIMATE':
        return {...action.data};
      case 'ESTIMATING':
        return {...state, estimating: action.estimating}
    
      default:
        return state;
    }
  }

  const [data, dispatchPostData] = useReducer(covidEstimatorReducer, { fetching: false, data: {} });

  const handleSubmit = (event) => {
    event.preventDefault();
    // set data values
    data.reportedCases = document.getElementById('reportedCases').value;
    data.population = document.getElementById('population').value;
    data.periodType = document.getElementById('periodType').value;
    data.timeToElapse = document.getElementById('timeToElapse').value;
    data.region = document.getElementById('region').value;
    data.totalHospitalBeds = document.getElementById('totalHospitalBeds').value;
    data.avgDailyIncomePopulation = document.getElementById('avgDailyIncomePopulation').value;
    data.avgDailyIncomeInUSD = document.getElementById('avgDailyIncomeInUSD').value;
    // make chart visible
    document.getElementById('outputChart').style.display = 'block';
    document.getElementById('outputChart').focus();
    return data;
  }

  // chart props
  const [chartData, setChartData] = useState({})
  const [chartOptions, setChartOptions] = useState({});
  // using covid estimator
  useCovidEstimator(data, dispatchPostData, setChartData, setChartOptions);


  return (
    <div className='container'>
      <div className="row d-flex m-4 justify-content-center">
        <h2 className="text-center"> COVID19 ESTIMATOR </h2>
      </div>
      <div className="row" id="outputChart" tabIndex="0" style={{display: "none"}}>
        <Bar
        data={chartData}
        options={chartOptions}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <h2 className="font-weight-semi-bold text-center m-2">estimate</h2>
        <div className="form-group row">
          <div className="col-6">
            <label htmlFor="reportedCases">Reported Cases</label>
            <input type="number" id="reportedCases" data-reported-cases="" className="form-control"></input>
          </div>
          <div className="col-6">
            <label htmlFor="population">Population Size</label>
            <input type="number" data-population="" id="population" className="form-control"></input>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-6">
            <label htmlFor="periodType">Period Type</label>
            <select id="periodType" data-period-type="" className="form-control">
              <option value="days" name="days">days</option>
              <option value="weeks" name="weeks">weeks</option>
              <option value="months" name="months">months</option>
            </select>
          </div>
          <div className="col-6">
            <label htmlFor="timeToElapse">Time to Elapse</label>
            <input type="number" id="timeToElapse" data-time-to-elapse="" className="form-control"></input>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-4">
            <label htmlFor="region">Region</label>
            <input id="region" type="text" className="form-control"></input>            
          </div>
          <div className="col-8">
            <label htmlFor="totalHospitalBeds">Total Hospital Beds</label>
            <input type="number" id="totalHospitalBeds" data-total-hospital-beds="" className="form-control"></input>            
          </div>
        </div>
        <div className="form-group row">
          <div className="col-10 offset-1">
            <label htmlFor="avgDailyIncomePopulation">Average Daily Income Population</label>
            <div className="input-group">
            <input type="number" id="avgDailyIncomePopulation" className="form-control"></input>
              <div className="input-group-append">
                <div className="input-group-text">%</div>
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
              <input type="number" step="any" min="0.00" id="avgDailyIncomeInUSD" data-avg-daily-income-in-usd="" className="form-control"></input>
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
