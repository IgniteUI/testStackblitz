import { IgrRadialGauge } from 'igniteui-react-gauges';
import { IgrRadialGaugeModule } from 'igniteui-react-gauges';
import * as React from "react";
import "../styles.css";
import "./SharedStyles.css";
import { SharedComponent } from "./SharedComponent";

IgrRadialGaugeModule.register();

export default class RadialGaugeScale extends SharedComponent {

    constructor(props: any) {
        super(props);

        this.state = { componentVisible: true }
    }

    public render() {
        return (
            <div className="sampleFlexRows">
            <IgrRadialGauge
                scaleStartAngle={135}
                scaleEndAngle={45}
                scaleBrush="DodgerBlue"
                scaleSweepDirection="Clockwise"
                scaleOversweep={1}
                scaleOversweepShape="Fitted"
                scaleStartExtent={0.45}
                scaleEndExtent={0.575}

                height="100%"
                width="100%"
                minimumValue={0} value={50}
                maximumValue={80} interval={10} />
            </div>
        );
    }
}