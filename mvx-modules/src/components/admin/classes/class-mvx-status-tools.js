import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { css } from "@emotion/react";
import PuffLoader from "react-spinners/PuffLoader";

import {
  BrowserRouter as Router,
  Link,
  useLocation,
  withRouter,
  useParams,
  NavLink
} from "react-router-dom";

import TabSection from './class-mvx-page-tab';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: green;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list_of_system_info: [],
      list_of_system_info_copy_data: '',
      store_index_data: [],
    };

    this.QueryParamsDemo = this.QueryParamsDemo.bind(this);
    this.useQuery = this.useQuery.bind(this);
    this.Child = this.Child.bind(this);
    this.handle_tools_triggers = this.handle_tools_triggers.bind(this);
    this.open_closed_system_info = this.open_closed_system_info.bind(this);
  }

  open_closed_system_info(e, index, parent_index) {

    var set_index_data = this.state.store_index_data;

    set_index_data[parent_index] = set_index_data[parent_index] == 'false' ? 'true' : 'false';

    this.setState({
      store_index_data: set_index_data
    });
  }

  handle_tools_triggers(e, type) {
    axios({
      method: 'post',
      url: `${appLocalizer.apiUrl}/mvx_module/v1/tools_funtion`,
      data: {
        type: type,
      }
    })
    .then( ( responce ) => {
      if (responce.data.redirect_link) {
        window.location.href = responce.data.redirect_link;
      }
    });
  }

  componentDidMount() {
    axios.get(
    `${appLocalizer.apiUrl}/mvx_module/v1/fetch_system_info`
    )
    .then(response => {
      var store_index_data = [];
      if (response.data) {
        Object.entries(response.data).map((list_data, index_data) => 
          store_index_data[index_data] = 'false'
        )
      }
      this.setState({
        list_of_system_info: response.data,
        store_index_data: store_index_data
      });
    })

    axios.get(
    `${appLocalizer.apiUrl}/mvx_module/v1/system_info_copy_data`
    )
    .then(responsecopy => {
      this.setState({
        list_of_system_info_copy_data: responsecopy.data,
      });
    })
  }

  useQuery() {
    return new URLSearchParams(useLocation().hash);
  }

  QueryParamsDemo() {
    let use_query = this.useQuery();
    return (
      <TabSection
        model={appLocalizer.mvx_all_backend_tab_list['status-tools']}
        query_name={use_query.get("name")}
        funtion_name={this}
        tab_description="no"
        horizontally
      />
    );
  }

Child({ name }) {
  return (
        name = !name ? appLocalizer.mvx_all_backend_tab_list['status-tools'][0]['modulename'] : name,
        name == 'version-control' ?
          <div className="mvx-status-tools-content">
            <form>
              <header>
                <h3>Rollback to Previous Version</h3>
              </header>
              <p>If you are facing issues after an update, you can reinstall a previous version with this tool</p>
              <p className="description warning"><strong>Warning Previous versions may not be secure or stable. Proceed with caution and always create a backup<span className="warning"></span></strong></p>

            <table className="form-table">
              <tbody>
                <tr>
                <th scope="row"><label>Your Version</label></th>
                  <td>
                  
                  </td>
                </tr>
              </tbody>
            </table>
            </form>
          </div>

            :

            name == appLocalizer.mvx_all_backend_tab_list['status-tools'][0]['modulename'] ?

            <div className="mvx-status-database-tools-content">
              <div className="mvx-vendor-transients">
                <div className="mvx-text-with-line-wrapper">
                  <div className="mvx-report-text w-100 mr-0"><span> WCMp vendors transients</span></div>
                </div>
                <div className="mvx-vendor-transients-description">
                  This tool will clear all WCMp vendors transients cache.
                </div>
                <div className="mvx-vendor-transients-button">
                  <button type="button" className="btn border-btn" onClick={(e) => this.handle_tools_triggers(e, 'transients')}>Clear transients</button>
                </div>
              </div>

              <div className="mvx-vendor-transients">
                <div className="mvx-text-with-line-wrapper">
                  <div className="mvx-report-text w-100 mr-0"><span>Reset visitors stats table</span></div>
                </div>
                
                <div className="mvx-vendor-transients-description">
                  This tool will clear ALL the table data of WCMp visitors stats.
                </div>
                <div className="mvx-vendor-transients-button">
                  <button type="button" className="btn border-btn" onClick={(e) => this.handle_tools_triggers(e, 'visitor')}>Reset Database</button>
                </div>
              </div>

              <div className="mvx-vendor-transients">
                <div className="mvx-text-with-line-wrapper">
                  <div className="mvx-report-text w-100 mr-0"><span>Force WCMp order migrate</span></div>
                </div>
                
                <div className="mvx-vendor-transients-description">
                  This will regenerate all vendors older orders to individual orders
                </div>
                <div className="mvx-vendor-transients-button">
                  <button type="button" className="btn border-btn" onClick={(e) => this.handle_tools_triggers(e, 'migrate_order')}>Order Migrate</button>
                </div>
              </div>

              <div className="mvx-vendor-transients">
                <div className="mvx-text-with-line-wrapper">
                  <div className="mvx-report-text w-100 mr-0"><span> Multivendor Migration</span></div>
                </div>
                
                <div className="mvx-vendor-transients-description">
                  This will migrate older marketplace details
                </div>
                <div className="mvx-vendor-transients-button">
                  <button type="button" className="btn border-btn" onClick={(e) => this.handle_tools_triggers(e, 'migrate')}>Multivendor migrate</button>
                </div>
              </div>
            </div>

            :

            name == appLocalizer.mvx_all_backend_tab_list['status-tools'][1]['modulename'] ?
            
            <div className="mvx-status-tools-content">
            <header>
              <h3>System Info</h3>
            </header>

            {this.state.list_of_system_info_copy_data ? 
            <div className="site-health-copy-buttons">
              <div className="copy-button-wrapper">
                <button type="button" className="btn border-btn copy-button" data-clipboard-text={this.state.list_of_system_info_copy_data}>
                  Copy System Info to Clipboard
                </button>
                <span className="success hidden" aria-hidden="true">Copied!</span>
              </div>
            </div>
            : <PuffLoader css={override} color={"#cd0000"} size={100} loading={true} /> }

              { Object.entries(this.state.list_of_system_info).length > 0 ?
                Object.entries(this.state.list_of_system_info).map((list_data, index_data) => (
                  <div id="health-check-debug" className="health-check-accordion mb-24">
                    <h3 className="health-check-accordion-heading">
                      <button aria-expanded={this.state.store_index_data.length > 0 && this.state.store_index_data[index_data] == 'false' ? "false" : "true" } className="health-check-accordion-trigger" aria-controls={`health-check-accordion-block-${list_data[0]}`} type="button" onClick={(e) => this.open_closed_system_info(e, list_data[0], index_data)}>
                        <span className="title">
                        
                          {list_data[1].label}
                            {list_data[1].show_count ?  <span>({ Object.entries(list_data[1]['fields']).length  })</span> : ''}

                        </span>
                        <span className="icon" />
                      </button>
                    </h3>

                    <div id={`health-check-accordion-block-${list_data[0]}`} className="health-check-accordion-panel" hidden={this.state.store_index_data.length > 0 && this.state.store_index_data[index_data] == 'false' ? "hidden" : '' }>
                      
                    {list_data[1]['description'] ? list_data[1]['description'] : ''}

                    <table className="widefat striped health-check-table" role="presentation">
                      <tbody>
                      {
                        Object.entries(list_data[1]['fields']).map((list_data1, index_data1) => (
                            <tr>
                              <td>{list_data1[1]['label']}</td><td>{list_data1[1]['value']}</td>
                            </tr>
                        ))
                        
                      }
                      </tbody>
                    </table>
                    </div>
                  </div>
                )) : ''
              }

              <header className='mt-24'>
                <h3>Error Log</h3>
              </header>

              <p className="description">
                If you have enabled, errors will be stored in a log file. Here you can find the last 100 lines in reversed order so that you or the Rank Math support team can view it easily. The file cannot be edited here
              </p>

              <div className="site-health-copy-buttons">
                <div className="copy-button-wrapper">
                  <button type="button" className="btn border-btn copy-button" data-clipboard-text={appLocalizer.errors_log}>
                    Copy Log to Clipboard
                  </button>
                  <span className="success hidden" aria-hidden="true">Copied!</span>
                </div>
              </div>
              <textarea name="name" rows="16" cols="80" className="code large-text rank-math-code-box" disabled="disabled" id="rank-math-status-error-log">{appLocalizer.errors_log}</textarea>
            </div>
            : ''
  );
}

  render() {
    return (
      <Router>
        <this.QueryParamsDemo />
      </Router>
    );
  }
}
export default App;