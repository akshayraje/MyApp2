# General Steps


## Run npm install
```
npm install
```

## Make `@ostdotcom` directory in node_modules.

```
mkdir ./node_modules/\@ostdotcom/
cd ./node_modules/\@ostdotcom/
```

## Clone the react-native repository:
```
git clone https://github.com/ostdotcom/ost-wallet-sdk-react-native.git
```

## Checkout the required branch
```
cd ost-wallet-sdk-react-native
git checkout <BRANCH_NAME>
```

## To go to MyApp2 root directory:
```
cd ../../../
```

# iOS

## Setup `ostwalletrnsdk` folder
- Remove refrence of the `ostwalletrnsdk` inside MyApp2 group(floder with yellow color icon).
- Add refrence of `ostwalletrnsdk` folder to MyApp2 group by navigating to `node_modules/@ostdotcom/ost-wallet-sdk-react-native/ios`.

## To Update the sdk branch
- Edit the cartfile:
```
github "ostdotcom/ost-wallet-sdk-ios" "[SDK_BRANCH_NAME]"
```
- Run carthage update
```
cd ios
carthage update --cache-builds --platform ios
```



# Follow react-native setup steps.