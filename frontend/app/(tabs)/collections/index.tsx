import React from "react";
import {ScrollView, YStack, Card, Text} from "tamagui";
// Mock data for collections
const MOCK_COLLECTIONS = [
  {
    name: "Summer Casual",
    items: ["White T-shirt", "Blue Shorts", "Sneakers"],
  },
  {
    name: "Office Formal",
    items: ["Blue Blazer", "White Shirt", "Black Pants"],
  },
  {
    name: "Weekend Brunch",
    items: ["Floral Dress", "Sandals", "Sun Hat"],
  },
];

export default function CollectionsScreen() {
  return (
    <YStack flex={1} padding='$4' paddingTop='$6'>
      <Text fontSize='$6' fontWeight='bold' marginBottom='$4'>
        My Collections
      </Text>
      <ScrollView flex={1}>
        {MOCK_COLLECTIONS.map((collection, index) => (
          <Card key={index} elevate size='$4' bordered marginBottom='$3'>
            <Card.Header padded>
              <Text fontSize='$5' fontWeight='600'>
                {collection.name}
              </Text>
            </Card.Header>
            <Card.Footer padded>
              <YStack space='$2'>
                {collection.items.map((item, itemIndex) => (
                  <Text key={itemIndex} fontSize='$4' color='$gray11'>
                    • {item}
                  </Text>
                ))}
              </YStack>
            </Card.Footer>
          </Card>
        ))}
      </ScrollView>
    </YStack>
  );
}
