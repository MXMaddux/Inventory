function Root() {
    const [isAppLoading, setIsAppLoading] = useState(true);
    const authCtx = useContext(AuthContext);
  
    useEffect(() => {
      const tryLogin = async () => {
        const userData = await AsyncStorage.getItem("userData");
        if (!userData) {
          setIsAppLoading(false);
          return;
        }
        const transformedData = JSON.parse(userData);
        const { token, expiryDate } = transformedData;
  
        if (new Date(expiryDate) <= new Date() || !token) {
          setIsAppLoading(false);
          return;
        }
  
        const expirationTime = new Date(expiryDate).getTime() - new Date().getTime();
  
        authCtx.authenticate(token, expirationTime);
        setIsAppLoading(false);
      };
  
      tryLogin();
    }, []);
  
    useEffect(() => {
      if (isAppLoading) {
        SplashScreen.preventAutoHideAsync();
      } else {
        SplashScreen.hideAsync();
      }
    }, [isAppLoading]);
  
    if (isAppLoading) {
      return null;
    }
  
    return (
      <NavigationContainer>
        {authCtx.isAuthenticated && authCtx.token ? (
          <AuthenticatedStack />
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    );
  }

  export default Root;