{/*   <View className="h-32 mt-5">
        <ThemedText className="mx-2 mb-3 text-xl font-medium text-black">AI Generated Random Practice</ThemedText>
        <Carousel
          style={{
            width: "100%",
            height: 280,
            alignItems: "center",
            justifyContent: "center",
          }}
          width={400}
          height={280}
          pagingEnabled={pagingEnabled}
          snapEnabled={snapEnabled}
          mode={"vertical-stack"}
          loop={true}
          data={data}
          modeConfig={{
            snapDirection,
            stackInterval: 10,
          }}
          customConfig={() => ({ type: "positive", viewCount })}
          renderItem={({ index }) => (

            <Animated.View
              entering={FadeInRight.delay(
                (viewCount - index) * 100,
              ).duration(200)}
              className="bg-blue-600  rounded-2xl h-[150px] w-full flex-row items-center justify-center">
              <ThemedText className="font-bold text-white">
                Chat with AI to practice English
              </ThemedText>

            </Animated.View>
          )}
        />
      </View> */}