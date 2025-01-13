import React, {useEffect, useState} from "react";
import {ScrollView, Text, YStack, XStack, Card, Button} from "tamagui";
import {Image, Dimensions} from "react-native";
import {useAuth} from "@/context/authContext";
import {fetchOutfitLogs} from "@/app/services/calendar";
import {fetchCollections} from "@/app/services/collection";
import {fetchWardrobe} from "@/app/services/uplaodFile";
import {Collection} from "@/types/collection";
import {ClothItem} from "@/types/wardrobe";
import {OutfitLog} from "@/types/calendar";
import {StatsSkeleton} from "@/components/skeleton";
import {theme} from "@/theme/theme";
import {Ionicons} from "@expo/vector-icons";

interface WardrobeStats extends Record<string, any> {
  totalItems: number;
  itemsByCategory: Record<string, number>;
  mostUsedItems: Array<{item: ClothItem; usageCount: number}>;
  recentOutfits: OutfitLog[];
  totalOutfits: number;
  favoriteCategories: Array<{category: string; count: number}>;
  styleDiversity: number;
  outfitFrequency: number;
  seasonalBalance: Record<string, number>;
  lastOutfitDate?: string;
}

const SEASONAL_CATEGORIES = {
  Spring: ["T-shirts", "Shirts", "Jackets", "Pants", "Accessories"],
  Summer: ["T-shirts", "Shirts", "Pants", "Accessories"],
  Fall: ["Sweaters", "Jackets", "Pants", "Accessories"],
  Winter: ["Sweaters", "Blazers", "Jackets", "Pants", "Accessories"],
};

export default function StatsScreen() {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [stats, setStats] = useState<WardrobeStats>({
    totalItems: 0,
    itemsByCategory: {},
    mostUsedItems: [],
    recentOutfits: [],
    totalOutfits: 0,
    favoriteCategories: [],
    styleDiversity: 0,
    outfitFrequency: 0,
    seasonalBalance: {},
  });
  const {user, token} = useAuth();
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [wardrobeItems, collections, outfitLogs] = await Promise.all([
        fetchWardrobe(user?.uid!, token!),
        fetchCollections(token!),
        fetchOutfitLogs(token!),
      ]);

      const itemsByCategory = wardrobeItems.reduce((acc, item) => {
        acc[item.clothType] = (acc[item.clothType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate most used items with proper collection and wardrobe verification
      const itemUsageMap = new Map<
        string,
        {
          item: ClothItem;
          usageCount: number;
          collections: Set<string>;
        }
      >();

      // First, build a map of all valid wardrobe items
      const wardrobeMap = new Map(wardrobeItems.map((item) => [item.id, item]));

      // Track item usage across collections and outfits
      collections.forEach((collection: Collection) => {
        if (collection.items) {
          // Count how many outfits use this collection
          const outfitCount = outfitLogs.filter(
            (log: OutfitLog) => log.collectionId === collection.id
          ).length;

          // For each item in the collection, increment usage by the number of outfits
          collection.items.forEach((collectionItem) => {
            const wardrobeItem = wardrobeMap.get(collectionItem.clothId);
            if (wardrobeItem) {
              const existingUsage = itemUsageMap.get(collectionItem.clothId);
              if (existingUsage) {
                existingUsage.usageCount += outfitCount;
                existingUsage.collections.add(collection.id);
              } else {
                itemUsageMap.set(collectionItem.clothId, {
                  item: wardrobeItem,
                  usageCount: outfitCount,
                  collections: new Set([collection.id]),
                });
              }
            }
          });
        }
      });

      // Convert to array and sort by usage count and collection diversity
      const mostUsedItems = Array.from(itemUsageMap.values())
        .sort((a, b) => {
          // First sort by usage count
          const countDiff = b.usageCount - a.usageCount;
          if (countDiff !== 0) return countDiff;
          // Then by number of different collections it appears in
          return b.collections.size - a.collections.size;
        })
        .slice(0, 5)
        .map(({item, usageCount}) => ({item, usageCount}));

      const categoryCount = Object.keys(itemsByCategory).length;
      const maxCategories = 10;
      const distributionScore = Object.values(itemsByCategory).reduce(
        (score, count) => score + (count > 1 ? 15 : 5),
        0
      );
      const styleDiversity = Math.min(
        Math.round(
          (categoryCount / maxCategories) * 50 + (distributionScore / 100) * 50
        ),
        100
      );

      const firstOutfitDate = outfitLogs[outfitLogs.length - 1]?.date;
      const lastOutfitDate = outfitLogs[0]?.date;
      const outfitFrequency = firstOutfitDate
        ? Number(
            (
              (outfitLogs.length /
                Math.max(
                  1,
                  (new Date().getTime() - new Date(firstOutfitDate).getTime()) /
                    (1000 * 60 * 60 * 24 * 7)
                )) *
              7
            ).toFixed(1)
          )
        : 0;

      const seasonalBalance = Object.entries(SEASONAL_CATEGORIES).reduce(
        (acc: Record<string, number>, [season, categories]) => {
          const seasonScore = categories.reduce((score, category) => {
            const hasItems = wardrobeItems.some(
              (item) => item.clothType === category
            );
            return score + (hasItems ? 20 : 0);
          }, 0);
          acc[season] = seasonScore;
          return acc;
        },
        {} as Record<string, number>
      );

      const favoriteCategories = Object.entries(itemsByCategory)
        .map(([category, count]) => ({category, count}))
        .sort((a, b) => b.count - a.count);

      const validOutfits = outfitLogs
        .filter((log: OutfitLog) => {
          const collection = collections.find(
            (c: Collection) => c.id === log.collectionId
          );
          return collection && collection.items && collection.items.length > 0;
        })
        .slice(0, 5);

      setCollections(collections);
      setStats({
        totalItems: wardrobeItems.length,
        itemsByCategory,
        mostUsedItems,
        recentOutfits: validOutfits,
        totalOutfits: outfitLogs.length,
        favoriteCategories,
        styleDiversity,
        outfitFrequency,
        seasonalBalance,
        lastOutfitDate: lastOutfitDate || undefined,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching stats:", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  function getStyleInsight() {
    if (stats.styleDiversity >= 80) {
      return "Your wardrobe is incredibly diverse! You have a great mix of different clothing types.";
    } else if (stats.styleDiversity >= 60) {
      return "You have a good variety in your wardrobe. Consider adding more pieces to underrepresented categories.";
    } else {
      return "Your wardrobe could use more variety. Try exploring different clothing types!";
    }
  }

  function getFrequencyInsight() {
    if (stats.outfitFrequency >= 5) {
      return "You're a fashion enthusiast! You create new outfits frequently.";
    } else if (stats.outfitFrequency >= 3) {
      return "You regularly update your outfit choices. Keep it up!";
    } else {
      return "Try creating more outfit combinations to get the most out of your wardrobe!";
    }
  }

  if (loading) {
    return <StatsSkeleton />;
  }

  return (
    <ScrollView style={{backgroundColor: theme.background}}>
      <YStack padding='$4' space='$4'>
        {/* Personalized Header */}
        <YStack space='$2'>
          <Text fontSize='$8' fontWeight='bold' color={theme.text}>
            Wardrobe Analytics
          </Text>
          <Text fontSize='$4' color={theme.textSecondary}>
            {stats.lastOutfitDate
              ? `Last outfit created ${new Date(
                  stats.lastOutfitDate
                ).toLocaleDateString()}`
              : "Start creating outfits to see your stats!"}
          </Text>
        </YStack>

        {/* Overview Cards */}
        <XStack space='$4' flexWrap='wrap'>
          <Card
            flex={1}
            minWidth={screenWidth > 380 ? 150 : screenWidth / 2 - 32}
            backgroundColor={theme.cardBg}
            padding='$4'
            borderRadius='$4'>
            <YStack space='$2'>
              <Text fontSize='$6' fontWeight='bold' color={theme.text}>
                {stats.totalItems}
              </Text>
              <Text fontSize='$4' color={theme.textSecondary}>
                Total Items
              </Text>
            </YStack>
          </Card>
          <Card
            flex={1}
            minWidth={screenWidth > 380 ? 150 : screenWidth / 2 - 32}
            backgroundColor={theme.cardBg}
            padding='$4'
            borderRadius='$4'>
            <YStack space='$2'>
              <Text fontSize='$6' fontWeight='bold' color={theme.text}>
                {stats.totalOutfits}
              </Text>
              <Text fontSize='$4' color={theme.textSecondary}>
                Outfits Created
              </Text>
            </YStack>
          </Card>
        </XStack>

        {/* Style Score */}
        <Card backgroundColor={theme.cardBg} padding='$4' borderRadius='$4'>
          <YStack space='$3'>
            <Text fontSize='$6' fontWeight='bold' color={theme.text}>
              Style Diversity Score
            </Text>
            <XStack space='$2' alignItems='center'>
              <Text fontSize='$8' fontWeight='bold' color={theme.accent}>
                {stats.styleDiversity}
              </Text>
              <Text fontSize='$4' color={theme.textSecondary}>
                / 100
              </Text>
            </XStack>
            <Text fontSize='$4' color={theme.textSecondary}>
              {getStyleInsight()}
            </Text>
          </YStack>
        </Card>

        {/* Outfit Frequency */}
        <Card backgroundColor={theme.cardBg} padding='$4' borderRadius='$4'>
          <YStack space='$3'>
            <Text fontSize='$6' fontWeight='bold' color={theme.text}>
              Outfit Creation Frequency
            </Text>
            <XStack space='$2' alignItems='center'>
              <Text fontSize='$8' fontWeight='bold' color={theme.accent}>
                {stats.outfitFrequency}
              </Text>
              <Text fontSize='$4' color={theme.textSecondary}>
                outfits/week
              </Text>
            </XStack>
            <Text fontSize='$4' color={theme.textSecondary}>
              {getFrequencyInsight()}
            </Text>
          </YStack>
        </Card>

        {/* Most Used Items */}
        <Card backgroundColor={theme.cardBg} padding='$4' borderRadius='$4'>
          <Text
            fontSize='$6'
            fontWeight='bold'
            color={theme.text}
            marginBottom='$4'>
            Most Used Items
          </Text>
          {stats.mostUsedItems.length > 0 ? (
            <YStack space='$4'>
              {stats.mostUsedItems.map(({item, usageCount}) => (
                <XStack key={item.id} space='$3' alignItems='center'>
                  <Card
                    backgroundColor={theme.buttonBg}
                    padding={0}
                    borderRadius='$4'
                    overflow='hidden'>
                    <Image
                      source={{uri: item.imageUrl}}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 8,
                      }}
                    />
                  </Card>
                  <YStack flex={1} space='$1'>
                    <Text fontSize='$4' fontWeight='600' color={theme.text}>
                      {item.clothName}
                    </Text>
                    <Text fontSize='$3' color={theme.textSecondary}>
                      {item.clothType}
                    </Text>
                    <XStack space='$2' alignItems='center'>
                      <Ionicons name='repeat' size={14} color={theme.accent} />
                      <Text fontSize='$3' color={theme.accent}>
                        Used in {usageCount} outfit{usageCount !== 1 ? "s" : ""}
                      </Text>
                    </XStack>
                  </YStack>
                </XStack>
              ))}
            </YStack>
          ) : (
            <YStack alignItems='center' padding='$4'>
              <Ionicons
                name='shirt-outline'
                size={40}
                color={theme.textSecondary}
              />
              <Text
                fontSize='$4'
                color={theme.textSecondary}
                textAlign='center'
                marginTop='$2'>
                Start creating outfits to see your most used items!
              </Text>
            </YStack>
          )}
        </Card>

        {/* Category Distribution */}
        <Card backgroundColor={theme.cardBg} padding='$4' borderRadius='$4'>
          <Text
            fontSize='$6'
            fontWeight='bold'
            color={theme.text}
            marginBottom='$4'>
            Category Distribution
          </Text>
          <YStack space='$3'>
            {stats.favoriteCategories.map(({category, count}) => (
              <XStack
                key={category}
                justifyContent='space-between'
                alignItems='center'>
                <Text fontSize='$4' color={theme.text}>
                  {category}
                </Text>
                <XStack space='$2' alignItems='center'>
                  <Text fontSize='$4' color={theme.textSecondary}>
                    {count} items
                  </Text>
                  <Text fontSize='$3' color={theme.textSecondary}>
                    ({Math.round((count / stats.totalItems) * 100)}%)
                  </Text>
                </XStack>
              </XStack>
            ))}
          </YStack>
        </Card>

        {/* Seasonal Analysis */}
        <Card backgroundColor={theme.cardBg} padding='$4' borderRadius='$4'>
          <Text
            fontSize='$6'
            fontWeight='bold'
            color={theme.text}
            marginBottom='$4'>
            Seasonal Wardrobe Preparedness
          </Text>
          <YStack space='$3'>
            {Object.entries(SEASONAL_CATEGORIES).map(([season, categories]) => (
              <XStack
                key={season}
                justifyContent='space-between'
                alignItems='center'>
                <YStack flex={1}>
                  <Text fontSize='$4' color={theme.text}>
                    {season}
                  </Text>
                  <Text
                    fontSize='$3'
                    color={theme.textSecondary}
                    numberOfLines={1}>
                    {categories.join(", ")}
                  </Text>
                </YStack>
                <XStack space='$2' alignItems='center'>
                  <Text fontSize='$4' color={theme.textSecondary}>
                    {stats.seasonalBalance[season] || 0}% ready
                  </Text>
                </XStack>
              </XStack>
            ))}
          </YStack>
        </Card>

        {/* Recent Outfits */}
        <Card backgroundColor={theme.cardBg} padding='$4' borderRadius='$4'>
          <Text
            fontSize='$6'
            fontWeight='bold'
            color={theme.text}
            marginBottom='$4'>
            Recent Outfits
          </Text>
          {stats.recentOutfits.length > 0 ? (
            <YStack space='$4'>
              {stats.recentOutfits.map((outfit) => {
                const collection = collections.find(
                  (c) => c.id === outfit.collectionId
                );
                if (!collection) return null;

                return (
                  <XStack key={outfit.id} space='$3' alignItems='center'>
                    <Card
                      backgroundColor={theme.buttonBg}
                      padding={0}
                      borderRadius='$4'
                      overflow='hidden'>
                      <Image
                        source={{uri: outfit.thumbnailUrl}}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 8,
                        }}
                      />
                    </Card>
                    <YStack flex={1} space='$1'>
                      <Text fontSize='$4' fontWeight='600' color={theme.text}>
                        {collection.name}
                      </Text>
                      <Text fontSize='$3' color={theme.textSecondary}>
                        Created {new Date(outfit.date).toLocaleDateString()}
                      </Text>
                      <XStack space='$2' alignItems='center'>
                        <Ionicons
                          name='layers-outline'
                          size={14}
                          color={theme.accent}
                        />
                        <Text fontSize='$3' color={theme.accent}>
                          {collection.items?.length || 0} items
                        </Text>
                      </XStack>
                    </YStack>
                  </XStack>
                );
              })}
            </YStack>
          ) : (
            <YStack alignItems='center' padding='$4'>
              <Ionicons
                name='albums-outline'
                size={40}
                color={theme.textSecondary}
              />
              <Text
                fontSize='$4'
                color={theme.textSecondary}
                textAlign='center'
                marginTop='$2'>
                No outfits created yet. Start creating your first outfit!
              </Text>
            </YStack>
          )}
        </Card>
      </YStack>
    </ScrollView>
  );
}
