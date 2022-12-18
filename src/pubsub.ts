import { 
    DataType,
    resolveNodeId,
    AttributeIds 
} from "node-opcua";
import { 
    DataSetFieldContentMask,
    JsonDataSetMessageContentMask,
    JsonNetworkMessageContentMask,
    BrokerTransportQualityOfService,
    MyMqttJsonPubSubConnectionDataType,
    Transport,
    PublishedDataItemsDataType,
    MyMqttJsonPubSubConnectionDataTypeOptions
} from "node-opcua-pubsub-expander";
import { PubSubConfigurationDataType } from "node-opcua-types";


const createWriterGroup = (dataSetWriter: any) => {
    // todo add params for creating group as factory
    return {
        dataSetWriters: [dataSetWriter],
        enabled: true,
        publishingInterval: 1000,
        name: "WriterGroup1",
        messageSettings: {
            networkMessageContentMask: JsonNetworkMessageContentMask.PublisherId,
        },
        transportSettings: {
            requestedDeliveryGuarantee: BrokerTransportQualityOfService.AtMostOnce,
        },
    }
}


const createConnection = (broker: string) => {
    // add params
    const mqttBroker = broker;
    const dataSetWriter = {
        dataSetFieldContentMask: DataSetFieldContentMask.None,
        dataSetName: "PublishedDataSet1",
        dataSetWriterId: 1,
        enabled: true,
        name: "dataSetWriter1",
        messageSettings: {
            dataSetMessageContentMask:
                JsonDataSetMessageContentMask.DataSetWriterId |
                JsonDataSetMessageContentMask.MetaDataVersion
        },
        transportSettings: {
            queueName: "umati/json/data/urn:SampleServer-node-opcua/WriterGroup1/VariableDataSetWriter",
        },
    };

    const writerGroup = createWriterGroup(dataSetWriter)

    const opts: MyMqttJsonPubSubConnectionDataTypeOptions = {
        enabled: true,
        name: "Connection1",
        transportProfileUri: Transport.MQTT_JSON,
        transportSettings: {},
        address: {
            url: mqttBroker,
        },
        writerGroups: [writerGroup],
        readerGroups: []
    }
    return new MyMqttJsonPubSubConnectionDataType(opts)
}


const createPublishedDataSet = () => {
    // todo list as parameter
    const publishedDataSet = {
        name: "PublishedDataSet1",
        dataSetMetaData: {
            fields: [
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
            ],
        },
        dataSetSource: new PublishedDataItemsDataType({
            publishedData: [
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
            ],
        }),
    };
    return publishedDataSet;
}


export const constructMqttJsonPubSubConfiguration = (broker: string) => {
  const connection = createConnection(broker);
  const publishedDataSet = createPublishedDataSet();
  return new PubSubConfigurationDataType({
    connections: [connection],
    publishedDataSets: [publishedDataSet] });
}
