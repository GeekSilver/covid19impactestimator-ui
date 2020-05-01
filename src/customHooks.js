import { useEffect } from "react";

export const useCovidEstimator = (inputData, dispatch, setChartData, setChartOptions) => {
  useEffect(() => {
    // set data.fetching to true 
    dispatch({ type: 'FETCHING', fetching: true });
    // post data to get estimates from api 
    fetch(`https://covid19impactestimator.herokuapp.com/api/v1/on-covid-19/json`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputData)
      })
      .then(data => data.json())
      .then(data => {
        // set data
        dispatch({ type: 'FETCH', data });
        // set chartData
        setChartData(() => {
          return {
            labels: [
              'currently infected',
              'infections by requested time',
              'severe cases by requested time',
              'hospital beds by requested time',
              'cases for ICU by requested time',
              'cases for ventilators by requested time',
              'dollars in flight'
            ],
            datasets: [{
              label: 'Estimated Impact',
              data: [
                Math.trunc(data.impact.currentlyInfected),
                Math.trunc(data.impact.infectionsByRequestedTime),
                Math.trunc(data.impact.severeCasesByRequestedTime),
                Math.trunc(data.impact.hospitalBedsByRequestedTime),
                Math.trunc(data.impact.casesForICUByRequestedTime),
                Math.trunc(data.impact.casesForVentilatorsByRequestedTime),
                Math.trunc(data.impact.dollarsInFlight)
              ],
              backgroundColor: '#17a2b8',
              borderColor: '#007bff',
              borderWidth: 1
            },{
              label: 'Estimated severe Impact',
              data: [
                Math.trunc(data.severeImpact.currentlyInfected),
                Math.trunc(data.severeImpact.infectionsByRequestedTime),
                Math.trunc(data.severeImpact.severeCasesByRequestedTime),
                Math.trunc(data.severeImpact.hospitalBedsByRequestedTime),
                Math.trunc(data.severeImpact.casesForICUByRequestedTime),
                Math.trunc(data.severeImpact.casesForVentilatorsByRequestedTime),
                Math.trunc(data.severeImpact.dollarsInFlight)
              ],
              type: 'bar',
              backgroundColor: '#dc3545',
              borderColor: 
                'red',
              borderWidth: 1
            }]
          }
        });
        // set chart options
        setChartOptions(() => {
          return {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
        // set data.fetching to false
        dispatch({ type: 'FETCHING', fetching: false });
        if (data.impact.currentlyInfected){
          // make chart visible in lg devices
          document.getElementById('outputChart').classList.add('d-md-block');
          document.getElementById('outputChart').focus();          
          // make table visible in sm-devices 
          document.getElementById('sm-output').classList.remove('d-none');
          document.getElementById('sm-output').focus();
        }

      }).catch(error => {
        dispatch({ type: 'FETCHING', fetching: false });
        return error;
      });
  }, [inputData, dispatch, setChartData, setChartOptions]);

}
