import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public type OldUserProfile = {
    username : Text;
    level : Nat;
    xp : Nat;
    streak : Nat;
    fitnessGoal : Text;
    profilePic : ?Blob;
    lastWorkoutDate : Int;
    isBanned : Bool;
    isAdmin : Bool;
  };

  public type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  public type NewUserProfile = {
    username : Text;
    level : Nat;
    xp : Nat;
    streak : Nat;
    fitnessGoal : Text;
    profilePic : ?Blob;
    lastWorkoutDate : Int;
    isBanned : Bool;
    isAdmin : Bool;
    activeTheme : Text;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, oldProfile) {
        { oldProfile with activeTheme = "default" };
      }
    );
    { userProfiles = newProfiles };
  };
};
