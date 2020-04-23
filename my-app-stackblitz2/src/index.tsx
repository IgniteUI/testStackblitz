import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';
import { IgrCategoryChartModule } from 'igniteui-react-charts';
import { IgrCategoryChart} from 'igniteui-react-charts';
import { IIgrCategoryChartProps} from 'igniteui-react-charts';
 
interface IAppProps {
}
interface IAppState {
    data: any[];
    name: string
}
IgrCategoryChartModule.register();
 
class App extends Component<IAppProps, IAppState> {
 
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
          </div>
    );
  }
}
 
render(<App />, document.getElementById('root'));
