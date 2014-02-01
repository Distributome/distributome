function getParms(num1)
{
	var parms=new Array();
	switch(num1)
		{
			//Discrete uniform a,n
			case 1:
				parms[0]= Math.floor(Math.random()*41-20);
				parms[1] = Math.floor(Math.random()*50+1);
				break;
			
			//Pareto k,b
			case 2:
				parms[0]= Math.floor(Math.random()*50+1);
				parms[1] = Math.floor(Math.random()*50+1);
				break;
			//poisson lambda
			case 3:
				parms[0]= Math.floor(Math.random()*100+1);
				break;
			
			//negative binomial k,p
			case 4:
				parms[0]= Math.floor(Math.random()*20+1);
				parms[1] =Math.random();
				break;
			
			//hypergeometric m,k,n
			case 5:
				parms[0]= Math.floor(Math.random()*200+1);
				parms[1] = Math.floor(Math.random()*parms[0]+1);
				parms[2]= Math.floor(Math.random()*parms[0]+1);
				break;
			
			//exponential b
			case 6:
				parms[0]= Math.floor(Math.random()*10+1);
				break;
			
			//normal mu, sigma
			case 7:
				parms[0]= Math.floor(Math.random()*100-50);
				parms[1] = Math.floor(Math.random()*50+1);
				break;
				
			//geometric 1,p
			case 8:
				parms[0]= Math.floor(Math.random()/2+.25);
				break;
			
			//beta a,b
			case 9:
				parms[0]= Math.floor(Math.random()*50+1);
				parms[1] = Math.floor(Math.random()*50+1);
				break;
			
			//fdist n,d
			case 10:
				parms[0]= Math.floor(Math.random()*47+4);
				parms[1] = Math.floor(Math.random()*47+4);
				break;
			
			//log normal mu, sigma
			case 11:
				parms[0]= Math.floor(Math.random()*10-5);
				parms[1] = Math.random();
				break;
				
			//binomial n,p
			case 12:
				parms[0]= Math.floor(Math.random()*100+1);
				parms[1] = Math.random();
				break;
			
			//laplace a,b
			case 13:
				parms[0]= Math.floor(Math.random()*20-10);
				parms[1] = Math.floor(Math.random()*10+1);
				break;
				
			//maxwell boltzmann a
			case 14:
				parms[0]= Math.floor(Math.random()*10+1);
				break;
			
			//chisquare n
			case 15:
				parms[0]= Math.floor(Math.random()*50+1);
				break;
			
			//cont uniform a,a+w
			case 16:
				parms[0]= Math.floor(Math.random()*40-20);
				parms[1] = Math.floor(Math.random()*50+1);
				break;
				
			//gamma k,b
			case 17:
				parms[0]= Math.floor(Math.random()*10+1);
				parms[1] = Math.floor(Math.random()*10+1);
				break;
				
			//weibull k,b
			case 18:
				parms[0]= Math.floor(Math.random()*50+1);
				parms[1] = Math.floor(Math.random()*50+1);
				break;
			
			//cauchy a,b
			case 19:
				parms[0]= Math.floor(Math.random()*20-10);
				parms[1] = Math.floor(Math.random()*10+1);
				break;
				
			//arcsine n
			case 20:
				parms[0]= Math.floor(Math.random()*199+2);
				break;
			
			//students n
			case 21:
				parms[0]= Math.floor(Math.random()*50+1);
				break;
			
			//logistic a,b
			case 22:
				parms[0]= Math.floor(Math.random()*100-50);
				parms[1] = Math.floor(Math.random()*50+1);
				break;
			
		/*---------------------------------------End Simple-------------------------------------------*/
			
			//beta negative binomial a,b,k
			case 23:
				parms[0]= Math.floor(Math.random()*8+3);
				parms[1] = Math.floor(Math.random()*8+3);
				parms[2]= Math.floor(Math.random()*10+1);
				break;
			
			//Benford first digit b
			case 24:
				parms[0]= Math.floor(Math.random()*19+2);
				break;
			
			//beta binomial a,b,n
			case 25:
				parms[0]= Math.floor(Math.random()*50+1);
				parms[1] = Math.floor(Math.random()*50+1);
				parms[2]= Math.floor(Math.random()*50+1);
				break;
				
			//birthday m,n
			case 26:
				parms[0]= Math.floor(Math.random()*400+1);
				parms[1] = Math.floor(Math.random()*100+1);
				break;
				
			//expon log p,b
			case 27:
				parms[0]= Math.random()/2+.25;
				parms[1] = Math.floor(Math.random()*10+1);
				break;	
				
			//coupon m,k
			case 28:
				parms[0]= Math.floor(Math.random()*25+1);
				parms[1] = Math.floor(Math.random()*parms[0]+1);
				break;	
				
			//extremevalue a,b
			case 29:
				parms[0]= Math.floor(Math.random()*100-50);
				parms[1] = Math.floor(Math.random()*50+1);
				break;	
			
			//folded normal mu, sigma
			case 30:
				parms[0]= Math.floor(Math.random()*20-10);
				parms[1] = Math.floor(Math.random()*10+1);
				break;
			
			//hyper secant mu,sigma
			case 31:
				parms[0]= Math.floor(Math.random()*20-10);
				parms[1] = Math.floor(Math.random()*10+1);
				break;
			default:
				alert("Error:Unknown GraphType Encountered");
				break;
		}
		return parms;
}