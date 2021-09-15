import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { JWT_ACCESS_TOKEN_SECRET_PUBLIC } from './env';
import User from '~/models/userModel';

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: JWT_ACCESS_TOKEN_SECRET_PUBLIC
		},
		async (jwtPayload, done) => {
			try {
				const user = await User.getUserById(jwtPayload.sub);
				if (!user) {
					return done(null, false);
				}
				return done(null, user);
			} catch (err) {
				return done(err, false);
			}
		}
	)
);

export default passport;
