---
description: Comment générer l'APK pour l'application mobile (Android)
---

Pour générer l'APK de l'application `parent-mobile` avec Capacitor, suivez ces étapes :

### 1. Préparer le code web
Assurez-vous d'abord que votre projet web est compilé (génération du dossier `dist`).
```powershell
npm run build
```

### 2. Synchroniser avec Capacitor
Copiez les fichiers compilés dans le projet Android.
```powershell
npx cap sync
```

### 3. Ouvrir dans Android Studio
Lancez Android Studio pour finaliser la compilation native.
```powershell
npx cap open android
```

### 4. Générer l'APK dans Android Studio
Une fois Android Studio ouvert et le projet chargé :
1. Allez dans le menu en haut : **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. Attendez que la barre de progression en bas à droite se termine.
3. Une notification apparaîtra : cliquez sur **locate** pour trouver le fichier `app-debug.apk`.

> [!NOTE]
> Pour une version de production (Play Store), utilisez **Build** > **Generate Signed Bundle / APK...**.
