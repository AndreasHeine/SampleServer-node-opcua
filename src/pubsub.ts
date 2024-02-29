// Copyright 2021 (c) Andreas Heine
//
//   Licensed under the Apache License, Version 2.0 (the 'License');
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an 'AS IS' BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

import { 
    DataType,
    resolveNodeId,
    AttributeIds,
    getHostname
} from "node-opcua";
import { 
    DataSetFieldContentMask,
    JsonDataSetMessageContentMask,
    JsonNetworkMessageContentMask,
    BrokerTransportQualityOfService,
    MyMqttJsonPubSubConnectionDataType,
    Transport,
    PublishedDataItemsDataType,
    MyMqttJsonPubSubConnectionDataTypeOptions,
    MyMqttJsonWriterGroupDataTypeOptions,
    MyJsonDataSetWriterDataTypeOptions,
    PubSubConfigurationDataTypeOptions
} from "node-opcua-pubsub-expander";
import { 
    PubSubConfigurationDataType,
    PubSubConnectionDataTypeOptions,
    PublishedDataSetDataTypeOptions,
    FieldMetaDataOptions
} from "node-opcua-types";


const prefix = "umati"
const dataPrefix = `${prefix}/json/data/urn:SampleServer-node-opcua-${getHostname()}`
const metaPrefix = `${prefix}/json/metadata/urn:SampleServer-node-opcua-${getHostname()}`


const createWriterGroup = (name: string, dataSetWriter: MyJsonDataSetWriterDataTypeOptions): MyMqttJsonWriterGroupDataTypeOptions => {
    const writerGroup: MyMqttJsonWriterGroupDataTypeOptions = {
        dataSetWriters: [dataSetWriter],
        enabled: true,
        publishingInterval: 1000,
        name: name,
        messageSettings: {
            networkMessageContentMask: JsonNetworkMessageContentMask.PublisherId,
        },
        transportSettings: {
            requestedDeliveryGuarantee: BrokerTransportQualityOfService.AtMostOnce
        },
    }
    return writerGroup
}


const createConnection = (name: string, dataSetName: string, writerGroupName: string, broker: string, id: number): PubSubConnectionDataTypeOptions => {
    const dataSetWriter: MyJsonDataSetWriterDataTypeOptions = {
        dataSetFieldContentMask: DataSetFieldContentMask.None,
            // DataSetFieldContentMask.SourceTimestamp |
            // DataSetFieldContentMask.StatusCode,
        dataSetName: dataSetName,
        dataSetWriterId: id,
        enabled: true,
        name: name,
        messageSettings: {
            // dataSetMessageContentMask?: JsonDataSetMessageContentMask;
            dataSetMessageContentMask: JsonDataSetMessageContentMask.None
                // JsonDataSetMessageContentMask.DataSetWriterId | 
                // JsonDataSetMessageContentMask.MetaDataVersion |
                // JsonDataSetMessageContentMask.DataSetWriterName |
                // JsonDataSetMessageContentMask.MessageType |
                // JsonDataSetMessageContentMask.SequenceNumber |
                // JsonDataSetMessageContentMask.Status |
                // JsonDataSetMessageContentMask.Timestamp
        },
        transportSettings: {
            // queueName?: UAString;
            // resourceUri?: UAString;
            // authenticationProfileUri?: UAString;
            // requestedDeliveryGuarantee?: BrokerTransportQualityOfService;
            // metaDataQueueName?: UAString;
            // metaDataUpdateTime?: Double;
            queueName: `${dataPrefix}/${writerGroupName}/VariableDataSetWriter`,
            metaDataQueueName: `${metaPrefix}/${writerGroupName}/VariableDataSetWriter`,
            metaDataUpdateTime: 5000
        },
    };

    const writerGroup: MyMqttJsonWriterGroupDataTypeOptions = createWriterGroup(writerGroupName, dataSetWriter)

    const opts: MyMqttJsonPubSubConnectionDataTypeOptions = {
        enabled: true,
        name: `Connection_${id}_${broker}`,
        transportProfileUri: Transport.MQTT_JSON,
        transportSettings: {
            // resourceUri?: UAString;
            // authenticationProfileUri?: UAString;
        },
        address: {
            url: broker,
        },
        writerGroups: [writerGroup],
        readerGroups: []
    }
    return new MyMqttJsonPubSubConnectionDataType(opts)
}


const createPublishedDataSet1 = (): PublishedDataSetDataTypeOptions => {

    const fields: FieldMetaDataOptions[] = [
        // {
        //     name?: UAString;
        //     description?: (LocalizedTextLike | null);
        //     fieldFlags?: DataSetFieldFlags;
        //     builtInType?: Byte;
        //     dataType?: (NodeIdLike | null);
        //     valueRank?: Int32;
        //     arrayDimensions?: UInt32[] | null;
        //     maxStringLength?: UInt32;
        //     dataSetFieldId?: Guid;
        //     properties?: KeyValuePairOptions[] | null;
        // }
        {
            name: "MyHistoricalSetpointVar",
            builtInType: DataType.Double,
            dataType: resolveNodeId("Double"),
        },
        {
            name: "MyHistoricalVar",
            builtInType: DataType.Double,
            dataType: resolveNodeId("Double"),
        },
    ]

    const publishedData = [
        // {
        //     publishedVariable?: (NodeIdLike | null);
        //     attributeId?: UInt32;
        //     samplingIntervalHint?: Double;
        //     deadbandType?: UInt32;
        //     deadbandValue?: Double;
        //     indexRange?: NumericRange;
        //     substituteValue?: (VariantLike | null);
        //     metaDataProperties?: (QualifiedNameLike | null)[] | null;
        // }
        {
            attributeId: AttributeIds.Value,
            samplingIntervalHint: 1000,
            publishedVariable: `ns=1;i=1321`,
        },
        {
            attributeId: AttributeIds.Value,
            samplingIntervalHint: 1000,
            publishedVariable: `ns=1;i=1320`,
        },
    ]

    const publishedDataSet: PublishedDataSetDataTypeOptions = {
        name: "PublishedDataSet1",
        dataSetMetaData: {
            fields: fields,
        },
        dataSetSource: new PublishedDataItemsDataType({
            publishedData: publishedData,
        }),
    };
    return publishedDataSet;
}


const createPublishedDataSet2 = (): PublishedDataSetDataTypeOptions => {

    const fields: FieldMetaDataOptions[] = [
        // {
        //     name?: UAString;
        //     description?: (LocalizedTextLike | null);
        //     fieldFlags?: DataSetFieldFlags;
        //     builtInType?: Byte;
        //     dataType?: (NodeIdLike | null);
        //     valueRank?: Int32;
        //     arrayDimensions?: UInt32[] | null;
        //     maxStringLength?: UInt32;
        //     dataSetFieldId?: Guid;
        //     properties?: KeyValuePairOptions[] | null;
        // }
        {
            name: "MyVar",
            builtInType: DataType.Double,
            dataType: resolveNodeId("Double"),
        },
        {
            name: "normalStateNode",
            builtInType: DataType.Double,
            dataType: resolveNodeId("Number"),
        },
    ]

    const publishedData = [
        // {
        //     publishedVariable?: (NodeIdLike | null);
        //     attributeId?: UInt32;
        //     samplingIntervalHint?: Double;
        //     deadbandType?: UInt32;
        //     deadbandValue?: Double;
        //     indexRange?: NumericRange;
        //     substituteValue?: (VariantLike | null);
        //     metaDataProperties?: (QualifiedNameLike | null)[] | null;
        // }
        {
            attributeId: AttributeIds.Value,
            samplingIntervalHint: 1000,
            publishedVariable: `ns=1;i=1032`,
        },
        {
            attributeId: AttributeIds.Value,
            samplingIntervalHint: 1000,
            publishedVariable: `ns=1;i=1068`,
        },
    ]

    const publishedDataSet: PublishedDataSetDataTypeOptions = {
        name: "PublishedDataSet2",
        dataSetMetaData: {
            fields: fields,
        },
        dataSetSource: new PublishedDataItemsDataType({
            publishedData: publishedData,
        }),
    };
    return publishedDataSet;
}


export const constructMqttJsonPubSubConfiguration = (broker: string) => {
    const opts: PubSubConfigurationDataTypeOptions = {
        connections: [
            createConnection("dataSetWriter1", "PublishedDataSet1", "WriterGroup1", broker, 1),
            createConnection("dataSetWriter2", "PublishedDataSet2", "WriterGroup2", broker, 2)
        ],
        publishedDataSets: [
            createPublishedDataSet1(),
            createPublishedDataSet2()
        ]
    }
    return new PubSubConfigurationDataType(opts);
}
