import { IgrPieChart } from 'igniteui-react-charts';
import { IgrPieChartModule } from 'igniteui-react-charts';
import { IgrPieChartBase } from 'igniteui-react-charts';
import { IIgrPieChartBaseProps } from 'igniteui-react-charts';
import { IgrSliceClickEventArgs } from 'igniteui-react-charts';
import * as React from "react";
import "../styles.css";
import "./SharedStyles.css";
import { SharedComponent } from "./SharedComponent";

IgrPieChartModule.register();

export default class PieChartSelection extends SharedComponent {

    public data: any[];
    public chart: IgrPieChart;

    constructor(props: any) {
       super(props);

        this.initData();
        this.onPieRef = this.onPieRef.bind(this);
        this.onSliceClick = this.onSliceClick.bind(this);
    }

    public render() {
        return (
            <div style={{height: "100%", width: "100%", background: "white" }}>
                <label >
                   Selected Slices: {this.state.selectedLabel}
                </label>

                <IgrPieChart dataSource={this.state.data}
                            labelMemberPath="Company"
                            valueMemberPath="MarketShare"
                            width="100%"
                            height="calc(100% - 45px)"
                            ref={this.onPieRef}
                            selectionMode="multiple"
                            sliceClick={this.onSliceClick}/>
            </div>
        );
    }

    public onPieRef(chart: IgrPieChart) {
        this.chart  = chart;
    }

    public onSliceClick = (s: IgrPieChartBase<IIgrPieChartBaseProps>, e: IgrSliceClickEventArgs) => {

        let selectedSlices: string = "";
        const selectedItems = this.chart.selectedItems.toArray();

        for (const item of selectedItems) {
            selectedSlices += item.Company + ", ";
        }

        this.setState( {selectedLabel: selectedSlices } );
    }

    public initData() {
        this.state = { data: [
            { MarketShare: 30, Company: "Google",    },
            { MarketShare: 30, Company: "Apple",     },
            { MarketShare: 15, Company: "Microsoft", },
            { MarketShare: 15, Company: "Samsung",   },
            { MarketShare: 10, Company: "Other",     },
       ] }
    }
}