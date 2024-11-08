import {fetchCollections} from "@/app/services/collection";
import {fetchWardrobe} from "@/app/services/uplaodFile";
import {useAuth} from "@/context/authContext";
import {useEffect, useState} from "react";
import {ScrollView, Spinner, Text, View, YStack} from "tamagui";
import {CartesianChart, Line, Bar, PolarChart, Pie} from "victory-native";
import {Inter_600SemiBold} from "@expo-google-fonts/inter";
import {LinearGradient, useFont, vec} from "@shopify/react-native-skia";
import {fetchOutfitLogs} from "@/app/services/calendar";
import {Collection} from "@/types/collection";
import {ClothItem, Wardrobe} from "@/types/wardrobe";
import {OutfitLog} from "@/types/calendar";

export default function StatsScreen() {
  const [collectionData, setCollectionData] = useState<Collection[]>([]);
  const [wardrobeData, setWardrobeData] = useState<ClothItem[]>([]);
  const [outfitData, setOutfitData] = useState<OutfitLog[]>([]);
  const {user, token} = useAuth();
  const font = useFont(Inter_600SemiBold, 12);

  useEffect(() => {
    console.log("useEffect triggered");
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const wardrobeItems = await fetchWardrobe(user?.uid!, token!);

      const collectionItems = await fetchCollections(token!);

      const outfitItems = await fetchOutfitLogs(token!);

      if (wardrobeItems) {
        setWardrobeData(wardrobeItems);
      }
      if (collectionItems) {
        setCollectionData(collectionItems);
      }
      if (outfitItems) {
        setOutfitData(outfitItems);
      }
    } catch (error) {
      console.error("Error in fetchStats:", error);
      throw new Error(error as string);
    }
  }

  function randomNumber() {
    return Math.floor(Math.random() * 26) + 125;
  }
  function generateRandomColor(): string {
    const randomColor = Math.floor(Math.random() * 0xffffff);

    return `#${randomColor.toString(16).padStart(6, "0")}`;
  }
  const DATAPIE = Array.from({length: 5}, (_, index) => ({
    value: randomNumber(),
    color: generateRandomColor(),
    label: `Label ${index + 1}`,
  }));

  const collectionItems = collectionData.reduce((acc, item) => {
    item.items.forEach((item) => acc.push(item.clothId));
    return acc;
  }, [] as string[]);

  const filteredWardrobeData = wardrobeData.filter((item: ClothItem) =>
    collectionItems.includes(item.id!)
  );

  const filteredWardrobeDataItem = Object.entries(
    filteredWardrobeData.reduce((acc, item: ClothItem) => {
      acc[item.id!] = {
        count: (acc[item.id!]?.count || 0) + 1,
        clothItem: item.clothName,
      };
      return acc;
    }, {} as Record<string, {count: number; clothItem: string}>)
  ).map(([id, data]) => ({
    count: data.count,
    clothItem: data.clothItem,
  }));

  const filteredOutfitData = Object.entries(
    outfitData.reduce((acc, item: OutfitLog) => {
      acc[item.collectionId!] = {
        count: (acc[item.collectionId]?.count || 0) + 1,
        collectionName: item.collectionName,
      };
      return acc;
    }, {} as Record<string, {count: number; collectionName: string}>)
  ).map(([collectionId, data]) => ({
    collectionName: data.collectionName,
    count: data.count,
  }));

  console.log("filteredOutfitData", filteredOutfitData);

  const filteredClothTypeData = Object.entries(
    filteredWardrobeData.reduce((acc, item: ClothItem) => {
      acc[item.clothType] = acc[item.clothType] + 1 || 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([clothType, count]) => ({
    clothType,
    count,
    color: generateRandomColor(),
  }));

  const wardrobeChartData = filteredWardrobeDataItem.map((item, index) => ({
    count: item.count,
    clothItem: index + 1,
  }));

  const collectionChartData = filteredOutfitData.map((item, index) => ({
    count: item.count,
    x: index + 1,
  }));

  console.log("Final chart data:", collectionChartData);

  if (wardrobeChartData.length === 0) {
    console.log("No data available for chart");
    return <Text>No data available</Text>;
  }

  if (!collectionData.length || !wardrobeData.length || !outfitData.length) {
    return (
      <YStack padding='$3' space='$4' alignItems='center'>
        <Spinner size='large' color='$orange10' />
        <Text>Loading data...</Text>
      </YStack>
    );
  }

  return (
    <ScrollView style={{paddingHorizontal: 20}}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          marginBottom: 20,
          textAlign: "center",
        }}>
        Clothing Stats
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "800",
          marginRight: 18,
          marginBottom: 10,
        }}>
        Clothing Count
      </Text>
      <View style={{height: 250, marginBottom: 60}}>
        <CartesianChart
          data={wardrobeChartData}
          xKey='clothItem'
          yKeys={["count"]}
          domainPadding={{left: 40, right: 40}}
          axisOptions={{
            font,
            formatXLabel: (value) => {
              const index = Math.round(value) - 1;
              return index >= 0 && index < filteredWardrobeDataItem.length
                ? filteredWardrobeDataItem[index].clothItem
                : "";
            },
            tickCount: {x: Math.min(6, wardrobeChartData.length), y: 6},
          }}>
          {({points, chartBounds}) => (
            <Bar
              chartBounds={chartBounds}
              points={points.count}
              innerPadding={20}
              barWidth={40}
              animate={{type: "spring", duration: 700}}
              roundedCorners={{
                topLeft: 5,
                topRight: 5,
              }}>
              {
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 400)}
                  colors={["red", "blue"]}
                />
              }
            </Bar>
          )}
        </CartesianChart>
      </View>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "800",
          marginRight: 18,
          marginBottom: 10,
        }}>
        Clothing Type
      </Text>
      <View style={{height: 300, marginBottom: 60}}>
        <PolarChart
          data={filteredClothTypeData}
          labelKey={"clothType"}
          valueKey={"count"}
          colorKey={"color"}>
          <Pie.Chart>
            {({slice}) => (
              <Pie.Slice>
                <Pie.Label
                  font={font}
                  color='white'
                  text={`${slice.label}: ${slice.value}`} // Shows both label and value
                  radiusOffset={0.7} // Adjusts label position from center (0-1)
                />
              </Pie.Slice>
            )}
          </Pie.Chart>
        </PolarChart>
      </View>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "800",
          marginRight: 18,
          marginBottom: 10,
        }}>
        Collection Count
      </Text>
      <View style={{height: 250, marginBottom: 60}}>
        <CartesianChart
          data={collectionChartData}
          xKey='x'
          yKeys={["count"]}
          domainPadding={{left: 40, right: 40}}
          axisOptions={{
            font,
            formatXLabel: (value) => {
              const roundedValue = Math.floor(value) - 1;
              return roundedValue >= 0 &&
                roundedValue < filteredOutfitData.length
                ? filteredOutfitData[roundedValue].collectionName
                : "";
            },
            tickCount: {x: Math.min(6, collectionChartData.length), y: 6},
          }}>
          {({points, chartBounds}) => (
            <Bar
              chartBounds={chartBounds}
              points={points.count}
              innerPadding={20}
              barWidth={20}
              animate={{type: "spring", duration: 700}}
              roundedCorners={{
                topLeft: 5,
                topRight: 5,
              }}>
              {
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 400)}
                  colors={["red", "blue"]}
                />
              }
            </Bar>
          )}
        </CartesianChart>
      </View>
    </ScrollView>
  );
}
