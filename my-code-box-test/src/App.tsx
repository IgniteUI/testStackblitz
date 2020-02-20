import React, { Component } from 'react';
import { IgrCategoryChartModule } from 'igniteui-react-charts';
import { IgrCategoryChart} from 'igniteui-react-charts';

interface IAppProps {
}
interface IAppState {
    data: any[];
    name: string
}
IgrCategoryChartModule.register();

class App extends React.Component<any, any> {

  public data: any;
  constructor(props: Readonly<IAppProps>) {
    super(props);
    this.state = {
            data: [
              { Label: "A", Value: 5, Value2: 4 },
              { Label: "B", Value: 8, Value2: 2 },
              { Label: "C", Value: 2, Value2: 3 },
              { Label: "D", Value: 4, Value2: 4 },
              { Label: "E", Value: 5, Value2: 5 },
              { Label: "F", Value: 6, Value2: 4 },
              { Label: "G", Value: 3, Value2: 4 }
            ],
            name: 'React'
        };
    
  }
  render() {
  return (
    <div>
    {/* <Hello name={this.state.name} /> */}
    <IgrCategoryChart yAxisMinimumValue={0}
                      chartTitle="test"
                      width="500px"
                      height="500px"
                      dataSource={this.state.data} />
    <a target="_blank" href="https://codesandbox.io/s/github/IgniteUI/testStackblitz/tree/master/my-code-box-test?from-embed">
        <img alt="Edit fbusv" src="https://codesandbox.io/static/img/play-codesandbox.svg"/>
    </a>
  </div>
  );
}
}

export default App;
